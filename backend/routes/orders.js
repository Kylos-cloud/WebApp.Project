const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

function rowToOrder(row, items = []) {
  return {
    id: row.id,
    user_id: row.user_id,
    subtotal: row.subtotal,
    delFee: row.del_fee,
    ecoFee: row.eco_fee,
    total: row.total,
    payment: row.payment,
    delivery: row.delivery,
    status: row.status,
    timestamp: row.created_at,
    items: items.map(i => ({
      id: i.product_id,
      product_id: i.product_id,
      variant_id: i.variant_id,
      variantAttrs: i.variant_attrs || null,
      name: i.name,
      image: i.image,
      brand: i.brand,
      qty: i.qty,
      newPrice: i.price,
      oldPrice: i.old_price,
    })),
  };
}

// Compare two attr objects for equality (shallow, string values).
function attrsEqual(a, b) {
  if (!a || !b) return !a && !b;
  const ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  return ak.every(k => String(a[k]) === String(b[k]));
}

router.post('/', authRequired, async (req, res) => {
  const { items, delivery, payment, subtotal, delFee = 0, ecoFee = 0 } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items' });
  }

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const ids = items.map(i => i.id ?? i.product_id);
    const productRows = await client.query(
      'SELECT id, name, image, brand, new_price, old_price, stock FROM products WHERE id = ANY($1::int[])',
      [ids]
    );
    const productMap = new Map(productRows.rows.map(p => [p.id, p]));

    const variantRows = await client.query(
      'SELECT id, product_id, attrs, stock, price_delta, image FROM product_variants WHERE product_id = ANY($1::int[])',
      [ids]
    );
    const variantsByProduct = new Map();
    for (const v of variantRows.rows) {
      if (!variantsByProduct.has(v.product_id)) variantsByProduct.set(v.product_id, []);
      variantsByProduct.get(v.product_id).push(v);
    }

    let computedSubtotal = 0;
    const enriched = items.map(item => {
      const pid = item.id ?? item.product_id;
      const p = productMap.get(pid);
      if (!p) throw new Error(`Product ${pid} not found`);

      const reqAttrs = item.variantAttrs || null;
      const productVariants = variantsByProduct.get(pid) || [];

      let variant = null;
      if (productVariants.length > 0) {
        // Product has variants — require the client to specify which one.
        if (!reqAttrs) {
          throw new Error(`${p.name}: вариант сонгоно уу`);
        }
        variant = productVariants.find(v => attrsEqual(v.attrs, reqAttrs));
        if (!variant) {
          throw new Error(`${p.name}: тохирох вариант олдсонгүй`);
        }
        if (variant.stock < item.qty) {
          const attrStr = Object.values(reqAttrs).join(' / ');
          throw new Error(`${p.name} (${attrStr})-ийн нөөц хүрэхгүй байна (${variant.stock} ширхэг үлдсэн)`);
        }
      } else {
        // No variants — fall back to top-level stock.
        if (p.stock < item.qty) {
          throw new Error(`${p.name}-ийн нөөц хүрэхгүй байна (${p.stock} ширхэг үлдсэн)`);
        }
      }

      const unitPrice = p.new_price + (variant ? variant.price_delta || 0 : 0);
      computedSubtotal += unitPrice * item.qty;

      return {
        product_id: pid,
        variant_id: variant ? variant.id : null,
        variant_attrs: variant ? variant.attrs : null,
        name: p.name,
        // Snapshot the variant-specific image when available so order
        // history always shows the photo the customer was looking at.
        image: (variant && variant.image) || p.image,
        brand: p.brand,
        qty: item.qty,
        price: unitPrice,
        old_price: p.old_price,
      };
    });

    const finalSubtotal = subtotal ?? computedSubtotal;
    const finalTotal = finalSubtotal + Number(delFee) + Number(ecoFee);

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, subtotal, del_fee, eco_fee, total, payment, delivery)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, finalSubtotal, delFee, ecoFee, finalTotal, payment || null, delivery || null]
    );
    const order = orderResult.rows[0];

    const itemRows = [];
    for (const e of enriched) {
      const r = await client.query(
        `INSERT INTO order_items (order_id, product_id, variant_id, variant_attrs, name, image, brand, qty, price, old_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [order.id, e.product_id, e.variant_id, e.variant_attrs ? JSON.stringify(e.variant_attrs) : null,
         e.name, e.image, e.brand, e.qty, e.price, e.old_price]
      );
      itemRows.push(r.rows[0]);

      // Decrement stock: prefer variant-level, fall back to product-level.
      if (e.variant_id) {
        await client.query(
          'UPDATE product_variants SET stock = GREATEST(0, stock - $1) WHERE id = $2',
          [e.qty, e.variant_id]
        );
        // Keep aggregate in sync.
        await client.query(
          'UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2',
          [e.qty, e.product_id]
        );
      } else {
        await client.query(
          'UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2',
          [e.qty, e.product_id]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(rowToOrder(order, itemRows));
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

router.get('/', authRequired, async (req, res) => {
  const ordersRes = await db.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );
  const orderIds = ordersRes.rows.map(o => o.id);
  if (orderIds.length === 0) return res.json([]);

  const itemsRes = await db.query(
    'SELECT * FROM order_items WHERE order_id = ANY($1::int[])',
    [orderIds]
  );
  const itemsByOrder = new Map();
  for (const it of itemsRes.rows) {
    if (!itemsByOrder.has(it.order_id)) itemsByOrder.set(it.order_id, []);
    itemsByOrder.get(it.order_id).push(it);
  }

  res.json(ordersRes.rows.map(o => rowToOrder(o, itemsByOrder.get(o.id) || [])));
});

router.get('/:id', authRequired, async (req, res) => {
  const orderResult = await db.query(
    'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  );
  if (!orderResult.rows[0]) return res.status(404).json({ error: 'Not found' });

  const itemsResult = await db.query(
    'SELECT * FROM order_items WHERE order_id = $1',
    [req.params.id]
  );
  res.json(rowToOrder(orderResult.rows[0], itemsResult.rows));
});

module.exports = router;

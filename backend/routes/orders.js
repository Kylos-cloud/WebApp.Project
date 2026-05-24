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
      name: i.name,
      image: i.image,
      brand: i.brand,
      size: i.size || null,
      qty: i.qty,
      newPrice: i.price,
      oldPrice: i.old_price,
    })),
  };
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
      'SELECT id, name, image, brand, new_price, old_price, stock, size_stock FROM products WHERE id = ANY($1::int[])',
      [ids]
    );
    const productMap = new Map(productRows.rows.map(p => [p.id, p]));

    let computedSubtotal = 0;
    const enriched = items.map(item => {
      const pid = item.id ?? item.product_id;
      const p = productMap.get(pid);
      if (!p) throw new Error(`Product ${pid} not found`);
      const size = item.size || null;

      // size_stock JSON-той бөгөөд размер тодорхойлогдсон бол тухайн размерын нөөц шалгана
      if (size && p.size_stock && typeof p.size_stock === 'object') {
        const sizeQty = parseInt(p.size_stock[size]) || 0;
        if (sizeQty < item.qty) {
          throw new Error(`${p.name} (${size}) размерийн нөөц хүрэхгүй байна (${sizeQty} ширхэг үлдсэн)`);
        }
      } else if (p.stock < item.qty) {
        throw new Error(`${p.name}-ийн нөөц хүрэхгүй байна (${p.stock} ширхэг үлдсэн)`);
      }

      computedSubtotal += p.new_price * item.qty;
      return {
        product_id: pid,
        name: p.name,
        image: p.image,
        brand: p.brand,
        size,
        qty: item.qty,
        price: p.new_price,
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
        `INSERT INTO order_items (order_id, product_id, name, image, brand, size, qty, price, old_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [order.id, e.product_id, e.name, e.image, e.brand, e.size, e.qty, e.price, e.old_price]
      );
      itemRows.push(r.rows[0]);

      // Нөөцийг буулгана: size бий бол size_stock-аас, үгүй бол нийтээс
      if (e.size) {
        await client.query(
          `UPDATE products
             SET size_stock = jsonb_set(
                   COALESCE(size_stock, '{}'::jsonb),
                   ARRAY[$1::text],
                   to_jsonb(GREATEST(0, COALESCE((size_stock->>$1)::int, 0) - $2))
                 ),
                 stock = GREATEST(0, stock - $2)
           WHERE id = $3`,
          [e.size, e.qty, e.product_id]
        );
      } else {
        await client.query('UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2', [e.qty, e.product_id]);
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
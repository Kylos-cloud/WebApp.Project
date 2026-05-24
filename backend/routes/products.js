const express = require('express');
const db = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

function rowToProduct(r, variants = []) {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    tag: r.tag,
    image: r.image,
    oldPrice: r.old_price,
    newPrice: r.new_price,
    brand: r.brand,
    rating: Number(r.rating),
    stock: r.stock,
    variantOptions: r.variant_options || null,
    variants: variants.map(v => ({
      id: v.id,
      attrs: v.attrs,
      stock: v.stock,
      priceDelta: v.price_delta || 0,
      image: v.image || null,
    })),
    sku: r.sku,
    description: r.description,
  };
}

// Helper: load variants for a list of product ids and group them.
async function loadVariantsFor(productIds) {
  if (!productIds.length) return new Map();
  const res = await db.query(
    'SELECT id, product_id, attrs, stock, price_delta, image FROM product_variants WHERE product_id = ANY($1::int[]) ORDER BY id',
    [productIds]
  );
  const map = new Map();
  for (const v of res.rows) {
    if (!map.has(v.product_id)) map.set(v.product_id, []);
    map.get(v.product_id).push(v);
  }
  return map;
}

router.get('/all', async (req, res) => {
  const [products, brands, categories] = await Promise.all([
    db.query('SELECT * FROM products ORDER BY id'),
    db.query('SELECT * FROM brands ORDER BY id'),
    db.query('SELECT * FROM categories ORDER BY name'),
  ]);
  const variantsByProduct = await loadVariantsFor(products.rows.map(p => p.id));
  res.json({
    products: products.rows.map(p => rowToProduct(p, variantsByProduct.get(p.id) || [])),
    brands: brands.rows,
    categories: categories.rows,
  });
});

router.get('/', async (req, res) => {
  const { category, brand, tag, search } = req.query;
  const conditions = [];
  const values = [];

  if (category) { values.push(category); conditions.push(`category = $${values.length}`); }
  if (brand) { values.push(brand); conditions.push(`brand = $${values.length}`); }
  if (tag) { values.push(tag); conditions.push(`tag = $${values.length}`); }
  if (search) { values.push(`%${search}%`); conditions.push(`name ILIKE $${values.length}`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await db.query(`SELECT * FROM products ${where} ORDER BY id`, values);
  const variantsByProduct = await loadVariantsFor(result.rows.map(p => p.id));
  res.json(result.rows.map(p => rowToProduct(p, variantsByProduct.get(p.id) || [])));
});

router.get('/categories', async (req, res) => {
  const result = await db.query('SELECT * FROM categories ORDER BY name');
  res.json(result.rows);
});

router.get('/brands', async (req, res) => {
  const result = await db.query('SELECT * FROM brands ORDER BY id');
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
  const variantsByProduct = await loadVariantsFor([result.rows[0].id]);
  res.json(rowToProduct(result.rows[0], variantsByProduct.get(result.rows[0].id) || []));
});

router.post('/', authRequired, adminRequired, async (req, res) => {
  const { name, category, tag, image, oldPrice, newPrice, brand, rating, stock, variantOptions, sku, description } = req.body;
  const result = await db.query(
    `INSERT INTO products (name, category, tag, image, old_price, new_price, brand, rating, stock, variant_options, sku, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [name, category, tag, image, oldPrice, newPrice, brand, rating ?? 4.5, stock ?? 0, variantOptions ? JSON.stringify(variantOptions) : null, sku, description]
  );
  res.status(201).json(rowToProduct(result.rows[0]));
});

router.put('/:id', authRequired, adminRequired, async (req, res) => {
  const { name, category, tag, image, oldPrice, newPrice, brand, rating, stock, variantOptions, sku, description } = req.body;
  const result = await db.query(
    `UPDATE products SET name=$1, category=$2, tag=$3, image=$4, old_price=$5,
       new_price=$6, brand=$7, rating=$8, stock=$9, variant_options=$10, sku=$11, description=$12
     WHERE id=$13 RETURNING *`,
    [name, category, tag, image, oldPrice, newPrice, brand, rating, stock, variantOptions ? JSON.stringify(variantOptions) : null, sku, description, req.params.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rowToProduct(result.rows[0]));
});

router.patch('/:id', authRequired, adminRequired, async (req, res) => {
  const fields = ['name', 'category', 'tag', 'image', 'old_price', 'new_price', 'brand', 'rating', 'stock', 'variant_options', 'sku', 'description'];
  const map = { oldPrice: 'old_price', newPrice: 'new_price', variantOptions: 'variant_options' };
  const sets = [];
  const values = [];
  for (const [k, v] of Object.entries(req.body)) {
    const col = map[k] || (fields.includes(k) ? k : null);
    if (!col) continue;
    values.push(col === 'variant_options' && v !== null ? JSON.stringify(v) : v);
    sets.push(`${col} = $${values.length}`);
  }
  if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
  values.push(req.params.id);
  const result = await db.query(
    `UPDATE products SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rowToProduct(result.rows[0]));
});

router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

module.exports = router;

const express = require('express');
const db = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

function rowToProduct(r) {
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
    sizeStock: r.size_stock || null,
    sku: r.sku,
    description: r.description,
  };
}

router.get('/all', async (req, res) => {
  const [products, brands, categories] = await Promise.all([
    db.query('SELECT * FROM products ORDER BY id'),
    db.query('SELECT * FROM brands ORDER BY id'),
    db.query('SELECT * FROM categories ORDER BY name'),
  ]);
  res.json({
    products: products.rows.map(rowToProduct),
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
  res.json(result.rows.map(rowToProduct));
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
  res.json(rowToProduct(result.rows[0]));
});

router.post('/', authRequired, adminRequired, async (req, res) => {
  const { name, category, tag, image, oldPrice, newPrice, brand, rating, stock, sizeStock, sku, description } = req.body;
  const result = await db.query(
    `INSERT INTO products (name, category, tag, image, old_price, new_price, brand, rating, stock, size_stock, sku, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [name, category, tag, image, oldPrice, newPrice, brand, rating ?? 4.5, stock ?? 0, sizeStock ? JSON.stringify(sizeStock) : null, sku, description]
  );
  res.status(201).json(rowToProduct(result.rows[0]));
});

router.put('/:id', authRequired, adminRequired, async (req, res) => {
  const { name, category, tag, image, oldPrice, newPrice, brand, rating, stock, sizeStock, sku, description } = req.body;
  const result = await db.query(
    `UPDATE products SET name=$1, category=$2, tag=$3, image=$4, old_price=$5,
       new_price=$6, brand=$7, rating=$8, stock=$9, size_stock=$10, sku=$11, description=$12
     WHERE id=$13 RETURNING *`,
    [name, category, tag, image, oldPrice, newPrice, brand, rating, stock, sizeStock ? JSON.stringify(sizeStock) : null, sku, description, req.params.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rowToProduct(result.rows[0]));
});

router.patch('/:id', authRequired, adminRequired, async (req, res) => {
  const fields = ['name', 'category', 'tag', 'image', 'old_price', 'new_price', 'brand', 'rating', 'stock', 'size_stock', 'sku', 'description'];
  const map = { oldPrice: 'old_price', newPrice: 'new_price', sizeStock: 'size_stock' };
  const sets = [];
  const values = [];
  for (const [k, v] of Object.entries(req.body)) {
    const col = map[k] || (fields.includes(k) ? k : null);
    if (!col) continue;
    // size_stock-ыг JSON болгож тааруулна
    values.push(col === 'size_stock' && v !== null ? JSON.stringify(v) : v);
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
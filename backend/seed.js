require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./db');

async function main() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
  await db.query(schema);
  console.log('Schema created.');

  const dataPath = path.join(__dirname, '..', 'products.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  for (const c of data.categories) {
    await db.query(
      `INSERT INTO categories (id, name, image) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, image = EXCLUDED.image`,
      [c.id, c.name, c.image]
    );
  }
  console.log(`Inserted ${data.categories.length} categories.`);

  for (const b of data.brands) {
    await db.query(
      `INSERT INTO brands (id, name, image) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, image = EXCLUDED.image`,
      [b.id, b.name, b.image]
    );
  }
  console.log(`Inserted ${data.brands.length} brands.`);

  for (const p of data.products) {
    // sizeStock талбар JSON хэлбэрээр хадгална (хэрэв бичсэн бол).
    const sizeStockJson = p.sizeStock ? JSON.stringify(p.sizeStock) : null;
    await db.query(
      `INSERT INTO products
         (id, name, category, tag, image, old_price, new_price, brand, rating, stock, size_stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         name       = EXCLUDED.name,
         category   = EXCLUDED.category,
         tag        = EXCLUDED.tag,
         image      = EXCLUDED.image,
         old_price  = EXCLUDED.old_price,
         new_price  = EXCLUDED.new_price,
         brand      = EXCLUDED.brand,
         rating     = EXCLUDED.rating,
         stock      = EXCLUDED.stock,
         size_stock = EXCLUDED.size_stock`,
      [p.id, p.name, p.category, p.tag, p.image, p.oldPrice, p.newPrice, p.brand, p.rating, p.stock, sizeStockJson]
    );
  }
  console.log(`Inserted ${data.products.length} products.`);

  await db.query(
    `SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
     SELECT setval('brands_id_seq', (SELECT MAX(id) FROM brands));`
  );

  console.log('Seed complete.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
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

  let variantCount = 0;
  for (const p of data.products) {
    const variantOptsJson = p.variantOptions ? JSON.stringify(p.variantOptions) : null;
    await db.query(
      `INSERT INTO products
         (id, name, category, tag, image, old_price, new_price, brand, rating, stock, variant_options)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [p.id, p.name, p.category, p.tag, p.image, p.oldPrice, p.newPrice, p.brand, p.rating, p.stock, variantOptsJson]
    );

    if (Array.isArray(p.variants)) {
      for (const v of p.variants) {
        await db.query(
          `INSERT INTO product_variants (product_id, attrs, stock, price_delta, image)
           VALUES ($1, $2, $3, $4, $5)`,
          [p.id, JSON.stringify(v.attrs), v.stock || 0, v.priceDelta || 0, v.image || null]
        );
        variantCount++;
      }
    }
  }
  console.log(`Inserted ${data.products.length} products and ${variantCount} variants.`);

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

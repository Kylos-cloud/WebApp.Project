DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT
);

CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT REFERENCES categories(id),
  tag TEXT,
  image TEXT,
  old_price INTEGER NOT NULL,
  new_price INTEGER NOT NULL,
  brand TEXT,
  rating NUMERIC(2,1),
  stock INTEGER DEFAULT 0,
  -- Ordered list of variant axes for UI rendering, e.g.
  -- {"color": ["Black","White","Blue"], "storage": ["128GB","256GB"]}
  variant_options JSONB,
  sku TEXT,
  description TEXT
);

-- One row per concrete variant combination (e.g. Black + 128GB iPhone).
-- attrs holds the picked value on each axis, stock is per-variant.
CREATE TABLE product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  attrs JSONB NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  price_delta INTEGER NOT NULL DEFAULT 0,
  -- Optional per-variant photo. When set, the product page swaps the
  -- main image as soon as this variant is picked. NULL → fall back to
  -- the product's primary image.
  image TEXT,
  sku TEXT
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  subtotal INTEGER NOT NULL DEFAULT 0,
  del_fee INTEGER NOT NULL DEFAULT 0,
  eco_fee INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  payment TEXT,
  delivery JSONB,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
  variant_attrs JSONB,
  name TEXT NOT NULL,
  image TEXT,
  brand TEXT,
  qty INTEGER NOT NULL,
  price INTEGER NOT NULL,
  old_price INTEGER
);

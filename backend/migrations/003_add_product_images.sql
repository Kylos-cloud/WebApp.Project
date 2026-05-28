-- 003_add_product_images.sql
-- Extra gallery photos beyond the primary `image` column.
-- Stored as a JSONB array of URLs (or data: URIs).

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS images JSONB;

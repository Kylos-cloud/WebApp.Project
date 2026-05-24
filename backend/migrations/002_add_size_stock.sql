-- 002_add_size_stock.sql
-- Хэрэв өмнө нь schema.sql-ийг дахин ажиллуулаагүй DB дээр ажиллуулна.
-- "size_stock" багана нэмж размер бүрд тусдаа нөөц хадгална.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS size_stock JSONB;

ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS size TEXT;
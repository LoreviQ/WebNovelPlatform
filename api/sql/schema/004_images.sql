-- +goose Up
-- Add image_url columns to users and fictions tables for SQLite

ALTER TABLE users ADD COLUMN image_url TEXT;
ALTER TABLE fictions ADD COLUMN image_url TEXT;

-- +goose Down
-- SQLite does not support dropping columns directly. To drop, you would need to:
-- 1. Create a new table without the image_url column.
-- 2. Copy data from the old table to the new table.
-- 3. Drop the old table.
-- 4. Rename the new table to the old table's name.
-- This is a manual process and should be handled with care outside of migration scripts.
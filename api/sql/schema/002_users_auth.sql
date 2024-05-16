-- +goose Up
ALTER TABLE users
ADD email TEXT NOT NULL;
ALTER TABLE users
ADD passwordhash TEXT NOT NULL;

-- +goose Down
ALTER TABLE users
DROP COLUMN email, passwordhash;

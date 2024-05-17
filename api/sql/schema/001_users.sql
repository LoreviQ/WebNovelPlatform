-- +goose Up
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    name TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    passwordhash TEXT NOT NULL
);

-- +goose Down
DROP TABLE users;
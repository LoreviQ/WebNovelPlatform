-- +goose Up
CREATE TABLE tokens (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL,
    valid boolean NOT NULL,
    created_at TEXT NOT NULL,
    revoked_at TEXT
);

-- +goose Down
DROP TABLE tokens;
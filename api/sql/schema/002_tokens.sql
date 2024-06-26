-- +goose Up
CREATE TABLE tokens (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL,
    valid INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    revoked_at TEXT,
    userid TEXT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id)
);

-- +goose Down
DROP TABLE tokens;
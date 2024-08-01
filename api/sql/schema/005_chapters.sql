-- +goose Up
CREATE TABLE chapters (
    id TEXT PRIMARY KEY,
    fiction_id TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    published INTEGER NOT NULL,
    published_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (fiction_id) REFERENCES fictions(id)
);

-- +goose Down
DROP TABLE chapters;
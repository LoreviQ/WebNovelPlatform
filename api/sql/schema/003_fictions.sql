-- +goose Up
CREATE TABLE fictions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    authorid TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    published_at TEXT,
    published INTEGER NOT NULL,
    FOREIGN KEY (authorid) REFERENCES users(id)
);

-- +goose Down
DROP TABLE fictions;
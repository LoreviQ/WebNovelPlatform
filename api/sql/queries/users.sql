-- name: CreateUser :one
INSERT INTO users (id, created_at, updated_at, name, email, passwordhash)
VALUES (?, ?, ?, ?,?,?)
RETURNING *;


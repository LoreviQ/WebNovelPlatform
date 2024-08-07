-- name: CreateUser :one
INSERT INTO users (id, created_at, updated_at, name, email, passwordhash, image_url)
VALUES (?, ?, ?, ?, ?, ?, ?)
RETURNING *;


-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = ?;

-- name: GetUserById :one
SELECT * FROM users WHERE id = ?;

-- name: UpdateUser :one
UPDATE users SET updated_at = ?, name = ?, email = ?, passwordhash = ?, image_url = ? WHERE id = ? RETURNING *;

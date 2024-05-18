-- name: CreateToken :exec
INSERT INTO tokens (id, token, valid, created_at, revoked_at, userid)
VALUES (?, ?, ?, ?, ?, ?);

-- name: GetTokenByToken :one
SELECT * FROM tokens WHERE token = ?;
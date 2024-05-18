-- name: CreateToken :exec
INSERT INTO tokens (id, token, valid, created_at, revoked_at, userid)
VALUES (?, ?, ?, ?, ?, ?);

-- name: GetTokenByToken :one
SELECT * FROM tokens WHERE token = ?;

-- name: RevokeToken :exec
UPDATE tokens SET valid = ?, revoked_at = ? WHERE token = ?;
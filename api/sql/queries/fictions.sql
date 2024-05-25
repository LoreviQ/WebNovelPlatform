-- name: CreateFiction :one
INSERT INTO fictions (id, title, authorid, description, created_at, updated_at, published_at, published)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: GetFictionById :one
SELECT * FROM fictions WHERE id = ?;

-- name: GetFictionsByAuthorId :many
SELECT * FROM fictions WHERE authorid = ?
LIMIT ?;

-- name: UpdateFiction :one
UPDATE fictions SET updated_at = ?, title = ?, description = ?, id = ?
WHERE id = ? 
RETURNING *;

-- name: PublishFiction :one
UPDATE fictions SET published_at = ?, published = ? WHERE id = ? RETURNING *;

-- name: DeleteFiction :exec
DELETE FROM fictions WHERE id = ?;

-- name: GetPublishedFictions :many
SELECT * FROM fictions WHERE published = 1
LIMIT ?;
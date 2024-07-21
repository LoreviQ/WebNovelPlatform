-- name: CreateFiction :one
INSERT INTO fictions (id, title, authorid, description, created_at, updated_at, published_at, published, image_url)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: GetFictionById :one
SELECT * FROM fictions WHERE id = ?;

-- name: GetFictionByIdIfPublished :one
SELECT * FROM fictions WHERE id = ? and published = 1;

-- name: GetFictionsByAuthorId :many
SELECT * FROM fictions WHERE authorid = ?
LIMIT ?;

-- name: GetFictionsByAuthorIdIfPublished :many
SELECT * FROM fictions WHERE authorid = ? and published = ?
LIMIT ?;

-- name: UpdateFiction :one
UPDATE fictions SET updated_at = ?, title = ?, description = ?, id = ?, published_at = ?, published = ?, image_url = ?
WHERE id = ? 
RETURNING *;

-- name: PublishFiction :one
UPDATE fictions SET published_at = ?, published = ? WHERE id = ? RETURNING *;

-- name: DeleteFiction :exec
DELETE FROM fictions WHERE id = ?;

-- name: GetPublishedFictions :many
SELECT fictions.*, users.name AS author_name
FROM fictions
JOIN users ON users.id = fictions.authorid
WHERE fictions.published = 1
LIMIT ?;
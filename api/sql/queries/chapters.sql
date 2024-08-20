-- name: CreateChapter :one
INSERT INTO chapters (id, fiction_id, title, body, published, published_at, scheduled_at, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: GetChapterById :one
SELECT * FROM chapters WHERE id = ?;

-- name: GetChaptersByFictionId :many
SELECT * FROM chapters WHERE fiction_id = ?
ORDER BY 
  CASE 
    WHEN published = 1 THEN published_at 
    ELSE scheduled_at 
  END DESC
LIMIT ? OFFSET ?;

-- name: GetChaptersByFictionIdIfPublished :many
SELECT * FROM chapters WHERE fiction_id = ? AND published = 1
LIMIT ?;

-- name: UpdateChapter :one
UPDATE chapters SET updated_at = ?, title = ?, body = ?, published = ?, published_at = ?, scheduled_at = ?
WHERE id = ?
RETURNING *;

-- name: DeleteChapter :exec
DELETE FROM chapters WHERE id = ?;

-- name: GetChapterIds :many
SELECT id FROM chapters;

-- name: GetScheduledChaptersToPublish :many
SELECT * FROM chapters
WHERE scheduled_at <= ? AND published = 0;
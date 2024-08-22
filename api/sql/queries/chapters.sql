-- name: CreateChapter :one
INSERT INTO chapters (id, chapter_number, fiction_id, title, body, published, published_at, scheduled_at, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: GetChapterById :one
SELECT * FROM chapters WHERE id = ?;

-- name: GetChaptersByFictionId :many
SELECT * FROM chapters WHERE fiction_id = ?
ORDER BY chapter_number DESC
LIMIT ? OFFSET ?;

-- name: GetChaptersByFictionIdIfPublished :many
SELECT * FROM chapters WHERE fiction_id = ? AND published = 1
LIMIT ?;

-- name: UpdateChapter :one
UPDATE chapters SET chapter_number = ?, updated_at = ?, title = ?, body = ?, published = ?, published_at = ?, scheduled_at = ?
WHERE id = ?
RETURNING *;

-- name: DeleteChapter :exec
DELETE FROM chapters WHERE id = ?;

-- name: GetChapterIds :many
SELECT id FROM chapters;

-- name: GetScheduledChaptersToPublish :many
SELECT * FROM chapters
WHERE scheduled_at <= ? AND published = 0;

-- name: GetMaxChapterNumber :one
SELECT MAX(chapter_number) AS largest_chapter_number
FROM chapters
WHERE fiction_id = ?;
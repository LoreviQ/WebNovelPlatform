// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: chapters.sql

package database

import (
	"context"
	"database/sql"
)

const createChapter = `-- name: CreateChapter :one
INSERT INTO chapters (id, fiction_id, title, body, published, published_at, scheduled_at, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING id, fiction_id, title, body, published, published_at, scheduled_at, created_at, updated_at
`

type CreateChapterParams struct {
	ID          string
	FictionID   string
	Title       string
	Body        string
	Published   int64
	PublishedAt sql.NullString
	ScheduledAt sql.NullString
	CreatedAt   string
	UpdatedAt   string
}

func (q *Queries) CreateChapter(ctx context.Context, arg CreateChapterParams) (Chapter, error) {
	row := q.db.QueryRowContext(ctx, createChapter,
		arg.ID,
		arg.FictionID,
		arg.Title,
		arg.Body,
		arg.Published,
		arg.PublishedAt,
		arg.ScheduledAt,
		arg.CreatedAt,
		arg.UpdatedAt,
	)
	var i Chapter
	err := row.Scan(
		&i.ID,
		&i.FictionID,
		&i.Title,
		&i.Body,
		&i.Published,
		&i.PublishedAt,
		&i.ScheduledAt,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteChapter = `-- name: DeleteChapter :exec
DELETE FROM chapters WHERE id = ?
`

func (q *Queries) DeleteChapter(ctx context.Context, id string) error {
	_, err := q.db.ExecContext(ctx, deleteChapter, id)
	return err
}

const getChapterById = `-- name: GetChapterById :one
SELECT id, fiction_id, title, body, published, published_at, scheduled_at, created_at, updated_at FROM chapters WHERE id = ?
`

func (q *Queries) GetChapterById(ctx context.Context, id string) (Chapter, error) {
	row := q.db.QueryRowContext(ctx, getChapterById, id)
	var i Chapter
	err := row.Scan(
		&i.ID,
		&i.FictionID,
		&i.Title,
		&i.Body,
		&i.Published,
		&i.PublishedAt,
		&i.ScheduledAt,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getChapterIds = `-- name: GetChapterIds :many
SELECT id FROM chapters
`

func (q *Queries) GetChapterIds(ctx context.Context) ([]string, error) {
	rows, err := q.db.QueryContext(ctx, getChapterIds)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		items = append(items, id)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getChaptersByFictionId = `-- name: GetChaptersByFictionId :many
SELECT id, fiction_id, title, body, published, published_at, scheduled_at, created_at, updated_at FROM chapters WHERE fiction_id = ?
LIMIT ?
`

type GetChaptersByFictionIdParams struct {
	FictionID string
	Limit     int64
}

func (q *Queries) GetChaptersByFictionId(ctx context.Context, arg GetChaptersByFictionIdParams) ([]Chapter, error) {
	rows, err := q.db.QueryContext(ctx, getChaptersByFictionId, arg.FictionID, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Chapter
	for rows.Next() {
		var i Chapter
		if err := rows.Scan(
			&i.ID,
			&i.FictionID,
			&i.Title,
			&i.Body,
			&i.Published,
			&i.PublishedAt,
			&i.ScheduledAt,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getChaptersByFictionIdIfPublished = `-- name: GetChaptersByFictionIdIfPublished :many
SELECT id, fiction_id, title, body, published, published_at, scheduled_at, created_at, updated_at FROM chapters WHERE fiction_id = ? AND published = 1
LIMIT ?
`

type GetChaptersByFictionIdIfPublishedParams struct {
	FictionID string
	Limit     int64
}

func (q *Queries) GetChaptersByFictionIdIfPublished(ctx context.Context, arg GetChaptersByFictionIdIfPublishedParams) ([]Chapter, error) {
	rows, err := q.db.QueryContext(ctx, getChaptersByFictionIdIfPublished, arg.FictionID, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Chapter
	for rows.Next() {
		var i Chapter
		if err := rows.Scan(
			&i.ID,
			&i.FictionID,
			&i.Title,
			&i.Body,
			&i.Published,
			&i.PublishedAt,
			&i.ScheduledAt,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateChapter = `-- name: UpdateChapter :one
UPDATE chapters SET updated_at = ?, title = ?, body = ?, published = ?, published_at = ?, scheduled_at = ?
WHERE id = ?
RETURNING id, fiction_id, title, body, published, published_at, scheduled_at, created_at, updated_at
`

type UpdateChapterParams struct {
	UpdatedAt   string
	Title       string
	Body        string
	Published   int64
	PublishedAt sql.NullString
	ScheduledAt sql.NullString
	ID          string
}

func (q *Queries) UpdateChapter(ctx context.Context, arg UpdateChapterParams) (Chapter, error) {
	row := q.db.QueryRowContext(ctx, updateChapter,
		arg.UpdatedAt,
		arg.Title,
		arg.Body,
		arg.Published,
		arg.PublishedAt,
		arg.ScheduledAt,
		arg.ID,
	)
	var i Chapter
	err := row.Scan(
		&i.ID,
		&i.FictionID,
		&i.Title,
		&i.Body,
		&i.Published,
		&i.PublishedAt,
		&i.ScheduledAt,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

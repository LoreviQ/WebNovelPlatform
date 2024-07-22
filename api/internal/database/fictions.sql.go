// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: fictions.sql

package database

import (
	"context"
	"database/sql"
)

const createFiction = `-- name: CreateFiction :one
INSERT INTO fictions (id, title, authorid, description, created_at, updated_at, published_at, published, image_url)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING id, title, authorid, description, created_at, updated_at, published_at, published, image_url
`

type CreateFictionParams struct {
	ID          string
	Title       string
	Authorid    string
	Description string
	CreatedAt   string
	UpdatedAt   string
	PublishedAt sql.NullString
	Published   int64
	ImageUrl    sql.NullString
}

func (q *Queries) CreateFiction(ctx context.Context, arg CreateFictionParams) (Fiction, error) {
	row := q.db.QueryRowContext(ctx, createFiction,
		arg.ID,
		arg.Title,
		arg.Authorid,
		arg.Description,
		arg.CreatedAt,
		arg.UpdatedAt,
		arg.PublishedAt,
		arg.Published,
		arg.ImageUrl,
	)
	var i Fiction
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Authorid,
		&i.Description,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.PublishedAt,
		&i.Published,
		&i.ImageUrl,
	)
	return i, err
}

const deleteFiction = `-- name: DeleteFiction :exec
DELETE FROM fictions WHERE id = ?
`

func (q *Queries) DeleteFiction(ctx context.Context, id string) error {
	_, err := q.db.ExecContext(ctx, deleteFiction, id)
	return err
}

const getFictionById = `-- name: GetFictionById :one
SELECT id, title, authorid, description, created_at, updated_at, published_at, published, image_url FROM fictions WHERE id = ?
`

func (q *Queries) GetFictionById(ctx context.Context, id string) (Fiction, error) {
	row := q.db.QueryRowContext(ctx, getFictionById, id)
	var i Fiction
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Authorid,
		&i.Description,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.PublishedAt,
		&i.Published,
		&i.ImageUrl,
	)
	return i, err
}

const getFictionByIdIfPublished = `-- name: GetFictionByIdIfPublished :one
SELECT id, title, authorid, description, created_at, updated_at, published_at, published, image_url FROM fictions WHERE id = ? and published = 1
`

func (q *Queries) GetFictionByIdIfPublished(ctx context.Context, id string) (Fiction, error) {
	row := q.db.QueryRowContext(ctx, getFictionByIdIfPublished, id)
	var i Fiction
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Authorid,
		&i.Description,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.PublishedAt,
		&i.Published,
		&i.ImageUrl,
	)
	return i, err
}

const getFictionsByAuthorId = `-- name: GetFictionsByAuthorId :many
SELECT id, title, authorid, description, created_at, updated_at, published_at, published, image_url FROM fictions WHERE authorid = ?
LIMIT ?
`

type GetFictionsByAuthorIdParams struct {
	Authorid string
	Limit    int64
}

func (q *Queries) GetFictionsByAuthorId(ctx context.Context, arg GetFictionsByAuthorIdParams) ([]Fiction, error) {
	rows, err := q.db.QueryContext(ctx, getFictionsByAuthorId, arg.Authorid, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Fiction
	for rows.Next() {
		var i Fiction
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Authorid,
			&i.Description,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.PublishedAt,
			&i.Published,
			&i.ImageUrl,
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

const getFictionsByAuthorIdIfPublished = `-- name: GetFictionsByAuthorIdIfPublished :many
SELECT id, title, authorid, description, created_at, updated_at, published_at, published, image_url FROM fictions WHERE authorid = ? and published = ?
LIMIT ?
`

type GetFictionsByAuthorIdIfPublishedParams struct {
	Authorid  string
	Published int64
	Limit     int64
}

func (q *Queries) GetFictionsByAuthorIdIfPublished(ctx context.Context, arg GetFictionsByAuthorIdIfPublishedParams) ([]Fiction, error) {
	rows, err := q.db.QueryContext(ctx, getFictionsByAuthorIdIfPublished, arg.Authorid, arg.Published, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Fiction
	for rows.Next() {
		var i Fiction
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Authorid,
			&i.Description,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.PublishedAt,
			&i.Published,
			&i.ImageUrl,
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

const getPublishedFictions = `-- name: GetPublishedFictions :many
SELECT fictions.id, fictions.title, fictions.authorid, fictions.description, fictions.created_at, fictions.updated_at, fictions.published_at, fictions.published, fictions.image_url, users.name AS author_name
FROM fictions
JOIN users ON users.id = fictions.authorid
WHERE fictions.published = 1
AND (? IS NULL OR fictions.title LIKE '%' || ? || '%')
AND (? IS NULL OR users.name LIKE '%' || ? || '%')
AND (? IS NULL OR fictions.title LIKE '%' || ? || '%' OR users.name LIKE '%' || ? || '%')
LIMIT ?
OFFSET ?
`

type GetPublishedFictionsParams struct {
	Column1 interface{}
	Column2 sql.NullString
	Column3 interface{}
	Column4 sql.NullString
	Column5 interface{}
	Column6 sql.NullString
	Column7 sql.NullString
	Limit   int64
	Offset  int64
}

type GetPublishedFictionsRow struct {
	ID          string
	Title       string
	Authorid    string
	Description string
	CreatedAt   string
	UpdatedAt   string
	PublishedAt sql.NullString
	Published   int64
	ImageUrl    sql.NullString
	AuthorName  string
}

func (q *Queries) GetPublishedFictions(ctx context.Context, arg GetPublishedFictionsParams) ([]GetPublishedFictionsRow, error) {
	rows, err := q.db.QueryContext(ctx, getPublishedFictions,
		arg.Column1,
		arg.Column2,
		arg.Column3,
		arg.Column4,
		arg.Column5,
		arg.Column6,
		arg.Column7,
		arg.Limit,
		arg.Offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetPublishedFictionsRow
	for rows.Next() {
		var i GetPublishedFictionsRow
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Authorid,
			&i.Description,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.PublishedAt,
			&i.Published,
			&i.ImageUrl,
			&i.AuthorName,
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

const publishFiction = `-- name: PublishFiction :one
UPDATE fictions SET published_at = ?, published = ? WHERE id = ? RETURNING id, title, authorid, description, created_at, updated_at, published_at, published, image_url
`

type PublishFictionParams struct {
	PublishedAt sql.NullString
	Published   int64
	ID          string
}

func (q *Queries) PublishFiction(ctx context.Context, arg PublishFictionParams) (Fiction, error) {
	row := q.db.QueryRowContext(ctx, publishFiction, arg.PublishedAt, arg.Published, arg.ID)
	var i Fiction
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Authorid,
		&i.Description,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.PublishedAt,
		&i.Published,
		&i.ImageUrl,
	)
	return i, err
}

const updateFiction = `-- name: UpdateFiction :one
UPDATE fictions SET updated_at = ?, title = ?, description = ?, id = ?, published_at = ?, published = ?, image_url = ?
WHERE id = ? 
RETURNING id, title, authorid, description, created_at, updated_at, published_at, published, image_url
`

type UpdateFictionParams struct {
	UpdatedAt   string
	Title       string
	Description string
	ID          string
	PublishedAt sql.NullString
	Published   int64
	ImageUrl    sql.NullString
	ID_2        string
}

func (q *Queries) UpdateFiction(ctx context.Context, arg UpdateFictionParams) (Fiction, error) {
	row := q.db.QueryRowContext(ctx, updateFiction,
		arg.UpdatedAt,
		arg.Title,
		arg.Description,
		arg.ID,
		arg.PublishedAt,
		arg.Published,
		arg.ImageUrl,
		arg.ID_2,
	)
	var i Fiction
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Authorid,
		&i.Description,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.PublishedAt,
		&i.Published,
		&i.ImageUrl,
	)
	return i, err
}

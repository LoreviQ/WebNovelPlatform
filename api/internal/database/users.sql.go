// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: users.sql

package database

import (
	"context"
)

const createUser = `-- name: CreateUser :one
INSERT INTO users (id, created_at, updated_at, name, email, passwordhash)
VALUES (?, ?, ?, ?,?,?)
RETURNING id, created_at, updated_at, name, email, passwordhash
`

type CreateUserParams struct {
	ID           string
	CreatedAt    string
	UpdatedAt    string
	Name         string
	Email        string
	Passwordhash string
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, createUser,
		arg.ID,
		arg.CreatedAt,
		arg.UpdatedAt,
		arg.Name,
		arg.Email,
		arg.Passwordhash,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Email,
		&i.Passwordhash,
	)
	return i, err
}

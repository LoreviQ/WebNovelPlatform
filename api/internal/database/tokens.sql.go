// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: tokens.sql

package database

import (
	"context"
	"database/sql"
)

const createToken = `-- name: CreateToken :exec
INSERT INTO tokens (id, token, valid, created_at, revoked_at, userid)
VALUES (?, ?, ?, ?, ?, ?)
`

type CreateTokenParams struct {
	ID        string
	Token     string
	Valid     int64
	CreatedAt string
	RevokedAt sql.NullString
	Userid    string
}

func (q *Queries) CreateToken(ctx context.Context, arg CreateTokenParams) error {
	_, err := q.db.ExecContext(ctx, createToken,
		arg.ID,
		arg.Token,
		arg.Valid,
		arg.CreatedAt,
		arg.RevokedAt,
		arg.Userid,
	)
	return err
}

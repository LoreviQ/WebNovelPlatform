// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0

package database

import (
	"database/sql"
)

type Chapter struct {
	ID            string
	ChapterNumber int64
	FictionID     string
	Title         string
	Body          string
	Published     int64
	PublishedAt   sql.NullString
	ScheduledAt   sql.NullString
	CreatedAt     string
	UpdatedAt     string
}

type Fiction struct {
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

type Token struct {
	ID        string
	Token     string
	Valid     int64
	CreatedAt string
	RevokedAt sql.NullString
	Userid    string
}

type User struct {
	ID           string
	CreatedAt    string
	UpdatedAt    string
	Name         string
	Email        string
	Passwordhash string
	ImageUrl     sql.NullString
}

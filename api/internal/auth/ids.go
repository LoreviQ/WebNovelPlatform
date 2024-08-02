package auth

import (
	"context"
	"math/rand"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
)

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

// GenerateID generates a url-safe random string of the given length
func generateID(length int) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}

// CheckDuplicateID checks an id against a list of ids and returns true if the id is a duplicate
func checkDuplicateID(id string, ids []string) bool {
	for _, i := range ids {
		if i == id {
			return true
		}
	}
	return false
}

// GenerateUniqueChapterID generates a unique chapter id
func GenerateUniqueChapterID(db *database.Queries) (string, error) {
	for {
		id := generateID(6)
		ids, err := db.GetChapterIds(context.Background())
		if err != nil {
			return "", err
		}
		if !checkDuplicateID(id, ids) {
			return id, nil
		}
	}
}

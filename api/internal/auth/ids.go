package auth

import (
	"context"
	"crypto/rand"
	"math/big"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
)

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

// generateID generates a url-safe random string of the given length
func generateID(length int) (string, error) {
	b := make([]byte, length)
	for i := range b {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return "", err
		}
		b[i] = charset[num.Int64()]
	}
	return string(b), nil
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
		id, err := generateID(6)
		if err != nil {
			return "", err
		}
		ids, err := db.GetChapterIds(context.Background())
		if err != nil {
			return "", err
		}
		if !checkDuplicateID(id, ids) {
			return id, nil
		}
	}
}

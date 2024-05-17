package auth

import (
	"context"
	"fmt"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func authenticateUser(email string, passwordHash []byte, db *database.Queries) error {
	// Authenticate user
	// Check if the user exists
	// Check if the password is correct
	// Returns an error if the user does not exist or the password is incorrect
	user, err := db.GetUserByEmail(context.Background(), email)
	if err != nil {
		return fmt.Errorf("could not find user: %w", err)
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Passwordhash), passwordHash); err != nil {
		return fmt.Errorf("incorrect password: %w", err)
	}
	return nil
}

func IssueAccessToken(userID int, secret []byte) (string, error) {
	claims := jwt.RegisteredClaims{
		Issuer:    "wnp-access",
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		Subject:   fmt.Sprint(userID),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(secret)
	return signedToken, err
}

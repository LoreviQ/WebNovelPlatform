package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func AuthenticateUser(email string, password []byte, db *database.Queries) (*database.User, error) {
	// Authenticate user
	// Check if the user exists
	// Check if the password is correct
	// Returns an error if the user does not exist or the password is incorrect
	user, err := db.GetUserByEmail(context.Background(), email)
	if err != nil {
		return nil, fmt.Errorf("could not find user: %w", err)
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Passwordhash), password); err != nil {
		return nil, fmt.Errorf("incorrect password: %w", err)
	}
	return &user, nil
}

func IssueAccessToken(email string, secret []byte) (string, error) {
	claims := jwt.RegisteredClaims{
		Issuer:    "wnp-access",
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		Subject:   email,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(secret)
	return signedToken, err
}

func AuthenticateAccessToken(tokenString string, secret []byte) (string, error) {
	// Checks the access token against the provided secret
	// Returns the email if the token is valid
	// Returns an error if the token is invalid

	token, err := jwt.ParseWithClaims(tokenString, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})
	if err != nil {
		return "", fmt.Errorf("error parsing token: %w", err)
	}
	if !token.Valid {
		return "", fmt.Errorf("invalid token")
	}
	issuer, err := token.Claims.GetIssuer()
	if err != nil || issuer != "wnp-access" {
		return "", fmt.Errorf("invalid token issuer")
	}
	subject, err := token.Claims.GetSubject()
	if err != nil {
		return "", err
	}
	return subject, nil
}

func IssueRefreshToken() (string, error) {
	token := make([]byte, 32)
	_, err := rand.Read(token)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(token), nil
}

package auth

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// To change behaviour so tesats can be completed in a reasonable time
var TEST = false
var RTduration = time.Hour * 24 * 60

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

func IssueAccessToken(userID string, secret []byte) (string, time.Time, error) {
	duration := time.Hour*24 + time.Second*5
	if TEST {
		duration = time.Second * 15
	}
	expires := time.Now().Add(duration)
	claims := jwt.RegisteredClaims{
		Issuer:    "wnp-access",
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		ExpiresAt: jwt.NewNumericDate(expires),
		Subject:   userID,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(secret)
	return signedToken, expires, err
}

func AuthenticateAccessToken(tokenString string, secret []byte) (string, error) {
	// Checks the access token against the provided secret
	// Returns the userID if the token is valid
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

func IssueRefreshToken(userID string, DB *database.Queries, ctx context.Context) (string, time.Time, error) {
	tokenHex := make([]byte, 32)
	_, err := rand.Read(tokenHex)
	if err != nil {
		return "", time.Time{}, err
	}
	token := hex.EncodeToString(tokenHex)
	createdAt := time.Now()
	err = DB.CreateToken(ctx, database.CreateTokenParams{
		ID:        uuid.New().String(),
		Token:     token,
		Valid:     1,
		CreatedAt: createdAt.UTC().Format(time.RFC3339),
		RevokedAt: sql.NullString{
			String: "",
			Valid:  false,
		},
		Userid: userID,
	})
	if err != nil {
		return "", time.Time{}, err
	}
	return token, createdAt.Add(RTduration), nil
}

func AuthenticateRefreshToken(tokenString string, DB *database.Queries, ctx context.Context) (string, error) {
	token, err := DB.GetTokenByToken(ctx, tokenString)
	if err != nil {
		return "", fmt.Errorf("token not found")
	}
	if token.Valid == 0 {
		return "", fmt.Errorf("token is invalid")
	}
	createdAt, err := time.Parse(time.RFC3339, token.CreatedAt)
	if err != nil {
		return "", fmt.Errorf("error parsing token creation time")
	}
	if createdAt.Add(RTduration).Before(time.Now()) {
		return "", fmt.Errorf("token is expired")
	}
	return token.Userid, nil
}

func RefreshAccessToken(refreshToken string, DB *database.Queries, ctx context.Context, secret []byte) (string, time.Time, error) {
	userID, err := AuthenticateRefreshToken(refreshToken, DB, ctx)
	if err != nil {
		return "", time.Time{}, err
	}
	return IssueAccessToken(userID, secret)
}

func RevokeRefreshToken(tokenString string, DB *database.Queries, ctx context.Context) error {
	token, err := DB.GetTokenByToken(ctx, tokenString)
	if err != nil {
		return fmt.Errorf("token not found")
	}
	if token.Valid == 0 {
		return fmt.Errorf("token is invalid")
	}
	err = DB.RevokeToken(ctx, database.RevokeTokenParams{
		Valid: 0,
		RevokedAt: sql.NullString{
			String: time.Now().UTC().Format(time.RFC3339),
			Valid:  true,
		},
		Token: tokenString,
	})
	return err
}

package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func authenticateUser(email, password string) {
	// Authenticate user
	// Check if the user exists
	// Check if the password is correct
	// Returns an error if the user does not exist or the password is incorrect

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

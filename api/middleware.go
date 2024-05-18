package main

import (
	"log"
	"net/http"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/auth"
	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
)

type authedHandler func(http.ResponseWriter, *http.Request, database.User)

func (cfg *apiConfig) AuthMiddleware(handler authedHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// GET ACCESS TOKEN FROM HEADER
		header := r.Header.Get("Authorization")
		if header == "" {
			respondWithError(w, http.StatusUnauthorized, "No Authorization Header")
			return
		}
		token := header[len("Bearer "):]

		// AUTHENTICATE ACCESS TOKEN
		email, err := auth.AuthenticateAccessToken(token, cfg.JWT_Secret)
		if err != nil {
			log.Printf("Error authenticating access token: %s", err)
			respondWithError(w, http.StatusUnauthorized, err.Error())
			return
		}

		// GET USER BY EMAIL
		user, err := cfg.DB.GetUserByEmail(r.Context(), email)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, "Invalid email")
			return
		}
		handler(w, r, user)
	}
}

package main

import (
	"net/http"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/auth"
	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
)

type authedHandler func(http.ResponseWriter, *http.Request, database.User)

func (cfg *apiConfig) AuthMiddleware(handler authedHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// AUTH
		email, err := auth.AuthenticateAccessToken(r.Header.Get("Authorization"), cfg.JWT_Secret)
		if err != nil {
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

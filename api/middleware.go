package main

import (
	"fmt"
	"net/http"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/auth"
	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
)

type authedHandler func(http.ResponseWriter, *http.Request, database.User)

// Middleware to authenticate requests
func (cfg *apiConfig) AuthMiddleware(next authedHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, err := cfg.authenticateRequest(r)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, err.Error())
			return
		}
		next(w, r, user)
	}
}

// Middleware that only authenticates requests if the fiction is not published
func (cfg *apiConfig) IsPublishedMiddleware(next authedHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		fiction, err := cfg.DB.GetFictionById(r.Context(), id)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't get fiction")
			return
		}
		if fiction.Published == 1 {
			next(w, r, database.User{})
		} else {
			user, err := cfg.authenticateRequest(r)
			if err != nil {
				respondWithError(w, http.StatusUnauthorized, err.Error())
				return
			}
			next(w, r, user)
		}
	}
}

func (cfg *apiConfig) CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Helper function to auth requests
func (cfg *apiConfig) authenticateRequest(r *http.Request) (database.User, error) {
	// GET ACCESS TOKEN FROM HEADER
	header := r.Header.Get("Authorization")
	if header == "" {
		return database.User{}, fmt.Errorf("no Authorization Header")
	}
	token := header[len("Bearer "):]

	// AUTHENTICATE ACCESS TOKEN
	ID, err := auth.AuthenticateAccessToken(token, cfg.JWT_Secret)
	if err != nil {
		return database.User{}, err
	}

	// GET USER BY ID
	user, err := cfg.DB.GetUserById(r.Context(), ID)
	if err != nil {
		return database.User{}, fmt.Errorf("invalid subject in token")
	}

	return user, nil
}

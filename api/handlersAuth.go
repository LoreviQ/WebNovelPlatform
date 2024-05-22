package main

import (
	"log"
	"net/http"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/auth"
)

func (cfg *apiConfig) postLogin(w http.ResponseWriter, r *http.Request) {
	// REQUEST
	request, err := decodeRequest(w, r, struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}{})
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "failed to decode request body")
		return
	}

	// AUTHENTICATE USER
	user, err := auth.AuthenticateUser(request.Email, []byte(request.Password), cfg.DB)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	// CREATE JWT TOKENS
	accessToken, err := auth.IssueAccessToken(user.ID, cfg.JWT_Secret)
	if err != nil {
		log.Printf("Error Creating Access Token: %s", err)
		w.WriteHeader(500)
		return
	}
	refreshToken, err := auth.IssueRefreshToken(user.ID, cfg.DB, r.Context())
	if err != nil {
		log.Printf("Error Creating Refresh Token: %s", err)
		w.WriteHeader(500)
		return
	}

	// RESPONSE
	type responseStruct struct {
		ID           string `json:"id"`
		Email        string `json:"email"`
		AccessToken  string `json:"token"`
		RefreshToken string `json:"refresh"`
	}
	respondWithJSON(w, 200, responseStruct{
		ID:           user.ID,
		Email:        user.Email,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	})
}

func (cfg *apiConfig) postRefresh(w http.ResponseWriter, r *http.Request) {
	// GET REFRESH TOKEN FROM HEADER
	header := r.Header.Get("Authorization")
	if header == "" {
		respondWithError(w, http.StatusUnauthorized, "No Authorization Header")
		return
	}
	refreshToken := header[len("Bearer "):]

	// REFRESH ACCESS TOKEN
	accessToken, err := auth.RefreshAccessToken(refreshToken, cfg.DB, r.Context(), cfg.JWT_Secret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, err.Error())
		return
	}

	// RESPONSE
	type responseStruct struct {
		AccessToken string `json:"token"`
	}
	respondWithJSON(w, 200, responseStruct{
		AccessToken: accessToken,
	})
}

func (cfg *apiConfig) postRevoke(w http.ResponseWriter, r *http.Request) {
	// GET REFRESH TOKEN FROM HEADER
	header := r.Header.Get("Authorization")
	if header == "" {
		respondWithError(w, http.StatusUnauthorized, "No Authorization Header")
		return
	}
	refreshToken := header[len("Bearer "):]

	// REVOKE REFRESH TOKEN
	err := auth.RevokeRefreshToken(refreshToken, cfg.DB, r.Context())
	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	w.WriteHeader(200)
}

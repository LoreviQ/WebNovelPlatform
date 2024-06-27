package main

import (
	"log"
	"net/http"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/auth"
	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
)

func (cfg *apiConfig) getLogin(w http.ResponseWriter, r *http.Request, user database.User) {
	// RESPONSE
	type responseStruct struct {
		ID    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}
	respondWithJSON(w, 200, responseStruct{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	})
}

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
	accessToken, accessExpires, err := auth.IssueAccessToken(user.ID, cfg.JWT_Secret)
	if err != nil {
		log.Printf("Error Creating Access Token: %s", err)
		w.WriteHeader(500)
		return
	}
	refreshToken, refreshExpires, err := auth.IssueRefreshToken(user.ID, cfg.DB, r.Context())
	if err != nil {
		log.Printf("Error Creating Refresh Token: %s", err)
		w.WriteHeader(500)
		return
	}

	// RESPONSE
	type userData struct {
		ID    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}
	type accessTokenStruct struct {
		Token   string    `json:"token"`
		Expires time.Time `json:"expires"`
	}
	type refreshTokenStruct struct {
		Token   string    `json:"token"`
		Expires time.Time `json:"expires"`
	}
	type authData struct {
		AccessToken  accessTokenStruct  `json:"access"`
		RefreshToken refreshTokenStruct `json:"refresh"`
	}
	type responseStruct struct {
		UserData userData `json:"user"`
		AuthData authData `json:"auth"`
	}
	respondWithJSON(w, 200, responseStruct{
		UserData: userData{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		},
		AuthData: authData{
			AccessToken: accessTokenStruct{
				Token:   accessToken,
				Expires: accessExpires,
			},
			RefreshToken: refreshTokenStruct{
				Token:   refreshToken,
				Expires: refreshExpires,
			},
		},
	})
}

func (cfg *apiConfig) getRefresh(w http.ResponseWriter, r *http.Request) {
	// GET REFRESH TOKEN FROM HEADER
	header := r.Header.Get("Authorization")
	if header == "" {
		respondWithError(w, http.StatusUnauthorized, "No Authorization Header")
		return
	}
	refreshToken := header[len("Bearer "):]

	// Checks if the refresh token is valid
	_, err := auth.AuthenticateRefreshToken(refreshToken, cfg.DB, r.Context())
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	w.WriteHeader(http.StatusOK)
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
	accessToken, expires, err := auth.RefreshAccessToken(refreshToken, cfg.DB, r.Context(), cfg.JWT_Secret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, err.Error())
		return
	}

	// RESPONSE
	type responseStruct struct {
		Token   string    `json:"token"`
		Expires time.Time `json:"expires"`
	}
	respondWithJSON(w, 200, responseStruct{
		Token:   accessToken,
		Expires: expires,
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

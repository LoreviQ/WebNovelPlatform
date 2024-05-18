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
	accessToken, err := auth.IssueAccessToken(user.Email, cfg.JWT_Secret)
	if err != nil {
		log.Printf("Error Creating Access Token: %s", err)
		w.WriteHeader(500)
		return
	}

	// RESPONSE
	type responseStruct struct {
		ID          string `json:"id"`
		Email       string `json:"email"`
		AccessToken string `json:"token"`
	}
	respondWithJSON(w, 200, responseStruct{
		ID:          user.ID,
		Email:       user.Email,
		AccessToken: accessToken,
	})
}

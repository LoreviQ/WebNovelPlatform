package main

import (
	"log"
	"net/http"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/auth"
	"golang.org/x/crypto/bcrypt"
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
	hash, err := bcrypt.GenerateFromPassword([]byte(request.Password), 10)
	if err != nil {
		log.Printf("Error Generating password hash: %s", err)
		w.WriteHeader(500)
		return
	}
	user, err := auth.AuthenticateUser(request.Email, hash, cfg.DB)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	// CREATE JWT TOKENS
	accessToken, err := auth.IssueAccessToken(user.Name, cfg.JWT_Secret)
	if err != nil {
		log.Printf("Error Creating Access Token: %s", err)
		w.WriteHeader(500)
		return
	}

	// RESPONSE
	type responseStruct struct {
		Email       string `json:"email"`
		ID          string `json:"id"`
		AccessToken string `json:"token"`
	}
	respondWithJSON(w, 200, responseStruct{
		Email:       user.Email,
		ID:          user.ID,
		AccessToken: accessToken,
	})
}

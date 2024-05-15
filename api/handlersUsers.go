package main

import (
	"log"
	"net/http"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
	"github.com/google/uuid"
)

func (cfg *apiConfig) postUser(w http.ResponseWriter, r *http.Request) {
	// REQUEST
	request, err := decodeRequest(w, r, struct {
		Name string `json:"name"`
	}{})
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "failed to decode request body")
		return
	}

	// CREATE USER
	user, err := cfg.DB.CreateUser(r.Context(), database.CreateUserParams{
		ID:        uuid.New().String(),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Name:      request.Name,
	})
	if err != nil {
		log.Printf("Error creating user: %s", err)
		respondWithError(w, http.StatusInternalServerError, "Couldn't create user")
		return
	}

	// RESPONSE
	respondWithJSON(w, http.StatusOK, struct {
		ID        string    `json:"id"`
		CreatedAt time.Time `json:"created_at"`
		UpdatedAt time.Time `json:"updated_at"`
		Name      string    `json:"name"`
	}{
		ID:        user.ID,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		Name:      user.Name,
	})
}

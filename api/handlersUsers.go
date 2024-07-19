package main

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// GET USER
func (cfg *apiConfig) getUser(w http.ResponseWriter, r *http.Request) {
	// GET USER
	userID := r.PathValue("id")
	log.Print(userID)
	user, err := cfg.DB.GetUserById(r.Context(), userID)
	if err != nil {
		log.Printf("Error getting user: %s", err)
		respondWithError(w, http.StatusInternalServerError, "Couldn't get user")
		return
	}

	// RESPONSE
	respondWithJSON(w, http.StatusOK, struct {
		ID        string `json:"id"`
		CreatedAt string `json:"created_at"`
		UpdatedAt string `json:"updated_at"`
		Name      string `json:"name"`
		Email     string `json:"email"`
		ImageUrl  string `json:"image_url"`
	}{
		ID:        user.ID,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		Name:      user.Name,
		Email:     user.Email,
		ImageUrl:  user.ImageUrl.String,
	})

}

func (cfg *apiConfig) postUser(w http.ResponseWriter, r *http.Request) {
	// REQUEST
	request, err := decodeRequest(w, r, struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}{})
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "failed to decode request body")
		return
	}

	// CREATE USER
	hash, err := bcrypt.GenerateFromPassword([]byte(request.Password), 10)
	if err != nil {
		log.Printf("Error generating password hash: %s", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	user, err := cfg.DB.CreateUser(r.Context(), database.CreateUserParams{
		ID:           uuid.New().String(),
		CreatedAt:    time.Now().UTC().Format(time.RFC3339),
		UpdatedAt:    time.Now().UTC().Format(time.RFC3339),
		Name:         request.Name,
		Email:        request.Email,
		Passwordhash: string(hash),
	})
	if err != nil {
		log.Printf("Error creating user: %s", err)
		respondWithError(w, http.StatusInternalServerError, "Couldn't create user")
		return
	}

	// RESPONSE
	respondWithJSON(w, http.StatusCreated, struct {
		ID        string `json:"id"`
		CreatedAt string `json:"created_at"`
		UpdatedAt string `json:"updated_at"`
		Name      string `json:"name"`
		Email     string `json:"email"`
	}{
		ID:        user.ID,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		Name:      user.Name,
		Email:     user.Email,
	})
}

func (cfg *apiConfig) putUser(w http.ResponseWriter, r *http.Request, user database.User) {
	// REQUEST
	request, err := decodeRequest(w, r, struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}{})
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "failed to decode request body")
		return
	}

	// UPDATE USER
	hash, err := bcrypt.GenerateFromPassword([]byte(request.Password), 10)
	if err != nil {
		log.Printf("Error generating password hash: %s", err)
		w.WriteHeader(500)
		return
	}
	updatedUser, err := cfg.DB.UpdateUser(r.Context(), database.UpdateUserParams{
		ID:           user.ID,
		UpdatedAt:    time.Now().UTC().Format(time.RFC3339),
		Name:         request.Name,
		Email:        request.Email,
		Passwordhash: string(hash),
	})
	if err != nil {
		log.Printf("Error updating user: %s", err)
		respondWithError(w, http.StatusInternalServerError, "Couldn't update user")
		return
	}

	// RESPONSE
	respondWithJSON(w, http.StatusOK, struct {
		ID        string `json:"id"`
		CreatedAt string `json:"created_at"`
		UpdatedAt string `json:"updated_at"`
		Name      string `json:"name"`
		Email     string `json:"email"`
	}{
		ID:        updatedUser.ID,
		CreatedAt: updatedUser.CreatedAt,
		UpdatedAt: updatedUser.UpdatedAt,
		Name:      updatedUser.Name,
		Email:     updatedUser.Email,
	})
}

// Put User Profile Handler
//
// Updates a logged in users preferences without changing their username or password
func (cfg *apiConfig) putUserProfile(w http.ResponseWriter, r *http.Request, user database.User) {
	// REQUEST
	request, err := decodeRequest(w, r, struct {
		Email    string `json:"email"`
		ImageUrl string `json:"image_url"`
	}{})
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "failed to decode request body")
		return
	}

	// UPDATE USER
	_, err = cfg.DB.UpdateUser(r.Context(), database.UpdateUserParams{
		ID:           user.ID,
		UpdatedAt:    time.Now().UTC().Format(time.RFC3339),
		Name:         user.Name,
		Email:        request.Email,
		Passwordhash: user.Passwordhash,
		ImageUrl: sql.NullString{
			String: request.ImageUrl,
			Valid:  (request.ImageUrl != ""),
		},
	})
	if err != nil {
		log.Printf("Error updating user: %s", err)
		respondWithError(w, http.StatusInternalServerError, "Couldn't update user")
		return
	}

	// RESPONSE
	w.WriteHeader(http.StatusOK)
}

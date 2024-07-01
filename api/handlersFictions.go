package main

import (
	"database/sql"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
)

func (cfg *apiConfig) getFictions(w http.ResponseWriter, r *http.Request) {
	// GET FICTIONS
	fictions, err := cfg.DB.GetPublishedFictions(r.Context(), 20)
	if err != nil {
		log.Printf("Error getting fictions: %s", err)
		respondWithError(w, http.StatusInternalServerError, "Couldn't get fictions")
		return
	}

	// RESPONSE
	type response struct {
		ID          string         `json:"id"`
		Title       string         `json:"title"`
		Authorid    string         `json:"authorid"`
		Description string         `json:"description"`
		CreatedAt   string         `json:"created_at"`
		UpdatedAt   string         `json:"updated_at"`
		PublishedAt sql.NullString `json:"published_at"`
	}
	responseSlice := make([]response, 0, len(fictions))
	for _, fiction := range fictions {
		responseSlice = append(responseSlice, response{
			ID:          fiction.ID,
			Title:       fiction.Title,
			Authorid:    fiction.Authorid,
			Description: fiction.Description,
			CreatedAt:   fiction.CreatedAt,
			UpdatedAt:   fiction.UpdatedAt,
			PublishedAt: fiction.PublishedAt,
		})
	}
	respondWithJSON(w, http.StatusOK, responseSlice)
}

func (cfg *apiConfig) getFiction(w http.ResponseWriter, r *http.Request) {
	// GET FICTION ID
	id := r.PathValue("id")
	if id == "" {
		respondWithError(w, http.StatusBadRequest, "No ID provided")
		return
	}

	// GET FICTION
	fiction, err := cfg.DB.GetFictionById(r.Context(), id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't get fiction")
		return
	}

	// RESPONSE
	type response struct {
		ID          string         `json:"id"`
		Title       string         `json:"title"`
		Authorid    string         `json:"authorid"`
		Description string         `json:"description"`
		CreatedAt   string         `json:"created_at"`
		UpdatedAt   string         `json:"updated_at"`
		PublishedAt sql.NullString `json:"published_at"`
	}
	respondWithJSON(w, http.StatusOK, response{
		ID:          fiction.ID,
		Title:       fiction.Title,
		Authorid:    fiction.Authorid,
		Description: fiction.Description,
		CreatedAt:   fiction.CreatedAt,
		UpdatedAt:   fiction.UpdatedAt,
		PublishedAt: fiction.PublishedAt,
	})
}

// Post fiction handler
//
// Creates a new fiction from the request body
func (cfg *apiConfig) postFiction(w http.ResponseWriter, r *http.Request, user database.User) {
	// REQUEST
	request, err := decodeRequest(w, r, struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}{})
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "failed to decode request body")
		return
	}

	// CREATE FICTION
	fiction, err := cfg.DB.CreateFiction(r.Context(), database.CreateFictionParams{
		ID:          urlify(request.Title),
		Title:       request.Title,
		Authorid:    user.ID,
		Description: request.Description,
		CreatedAt:   time.Now().UTC().Format(time.RFC3339),
		UpdatedAt:   time.Now().UTC().Format(time.RFC3339),
		PublishedAt: sql.NullString{
			String: "",
			Valid:  false,
		},
		Published: 0,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't create fiction")
		return
	}

	// RESPONSE
	respondWithJSON(w, http.StatusCreated, struct {
		ID          string `json:"id"`
		Title       string `json:"title"`
		Authorid    string `json:"authorid"`
		Description string `json:"description"`
		CreatedAt   string `json:"created_at"`
	}{
		ID:          fiction.ID,
		Title:       fiction.Title,
		Authorid:    fiction.Authorid,
		Description: fiction.Description,
		CreatedAt:   fiction.CreatedAt,
	})
}

// Convert title to ID
func urlify(inputString string) string {
	// convert title to lowercase
	inputString = strings.ToLower(inputString)
	// replace spaces with hyphens
	inputString = strings.ReplaceAll(inputString, " ", "-")
	// remove all non-alphanumeric characters
	inputString = strings.Map(func(r rune) rune {
		if r >= 'a' && r <= 'z' || r >= '0' && r <= '9' || r == '-' {
			return r
		}
		return -1
	}, inputString)
	// return the first 20 characters
	if len(inputString) > 20 {
		inputString = inputString[:20]
	}

	return inputString
}

// Put Fiction Handler
//
// Updates a fiction from the request body
func (cfg *apiConfig) putFiction(w http.ResponseWriter, r *http.Request, user database.User) {
	// REQUEST
	request, err := decodeRequest(w, r, struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}{})
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "failed to decode request body")
		return
	}

	// PROCESS HEADERS
	id := r.PathValue("id")
	if id == "" {
		respondWithError(w, http.StatusBadRequest, "No ID provided")
		return
	}

	// CHECK USER IS AUTHOR
	fiction, err := cfg.DB.GetFictionById(r.Context(), id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't get fiction")
		return
	}
	if fiction.Authorid != user.ID {
		respondWithError(w, http.StatusForbidden, "User is not the author of this fiction")
		return
	}

	// UPDATE FICTION
	fiction, err = cfg.DB.UpdateFiction(r.Context(), database.UpdateFictionParams{
		UpdatedAt:   time.Now().UTC().Format(time.RFC3339),
		Title:       request.Title,
		Description: request.Description,
		ID:          urlify(request.Title),
		ID_2:        id,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't update fiction")
		return
	}

	// RESPONSE
	respondWithJSON(w, http.StatusOK, struct {
		ID          string `json:"id"`
		Title       string `json:"title"`
		Authorid    string `json:"authorid"`
		Description string `json:"description"`
		CreatedAt   string `json:"created_at"`
	}{
		ID:          fiction.ID,
		Title:       fiction.Title,
		Authorid:    fiction.Authorid,
		Description: fiction.Description,
		CreatedAt:   fiction.CreatedAt,
	})
}

// Delete Fiction Handler
//
// Deletes the fiction with the provided ID
func (cfg *apiConfig) deleteFiction(w http.ResponseWriter, r *http.Request, user database.User) {
	// PROCESS HEADERS
	id := r.PathValue("id")
	if id == "" {
		respondWithError(w, http.StatusBadRequest, "No ID provided")
		return
	}

	// CHECK USER IS AUTHOR
	fiction, err := cfg.DB.GetFictionById(r.Context(), id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't get fiction")
		return
	}
	if fiction.Authorid != user.ID {
		respondWithError(w, http.StatusForbidden, "User is not the author of this fiction")
		return
	}

	// DELETE FICTION
	err = cfg.DB.DeleteFiction(r.Context(), id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't delete fiction")
		return
	}

	// RESPONSE
	w.WriteHeader(http.StatusOK)
}

// Get Fictions By User Handler
//
// Returns all fictions published by the author with the provided ID
func (cfg *apiConfig) getFictionsByUser(w http.ResponseWriter, r *http.Request) {
	// PROCESS HEADERS
	id := r.PathValue("id")
	if id == "" {
		respondWithError(w, http.StatusBadRequest, "No ID provided")
		return
	}

	// GET FICTIONS
	fictions, err := cfg.DB.GetFictionsByAuthorId(r.Context(), database.GetFictionsByAuthorIdParams{
		Authorid:  id,
		Published: 1,
		Limit:     20,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't get fictions")
		return
	}

	// RESPONSE
	type response struct {
		ID          string         `json:"id"`
		Title       string         `json:"title"`
		Authorid    string         `json:"authorid"`
		Description string         `json:"description"`
		CreatedAt   string         `json:"created_at"`
		UpdatedAt   string         `json:"updated_at"`
		PublishedAt sql.NullString `json:"published_at"`
	}
	responseSlice := make([]response, 0, len(fictions))
	for _, fiction := range fictions {
		responseSlice = append(responseSlice, response{
			ID:          fiction.ID,
			Title:       fiction.Title,
			Authorid:    fiction.Authorid,
			Description: fiction.Description,
			CreatedAt:   fiction.CreatedAt,
			UpdatedAt:   fiction.UpdatedAt,
			PublishedAt: fiction.PublishedAt,
		})
	}
	respondWithJSON(w, http.StatusOK, responseSlice)
}

// Get ALL Fictions By User Handler
//
// Returns all fictions by the logged in author even if not published
func (cfg *apiConfig) getAllFictionsByUser(w http.ResponseWriter, r *http.Request, user database.User) {
	// GET FICTIONS
	fictions, err := cfg.DB.GetFictionsByAuthorId(r.Context(), database.GetFictionsByAuthorIdParams{
		Authorid:  user.ID,
		Published: 0,
		Limit:     20,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't get fictions")
		return
	}

	// RESPONSE
	type response struct {
		ID          string         `json:"id"`
		Title       string         `json:"title"`
		Authorid    string         `json:"authorid"`
		Description string         `json:"description"`
		CreatedAt   string         `json:"created_at"`
		UpdatedAt   string         `json:"updated_at"`
		PublishedAt sql.NullString `json:"published_at"`
	}
	responseSlice := make([]response, 0, len(fictions))
	for _, fiction := range fictions {
		responseSlice = append(responseSlice, response{
			ID:          fiction.ID,
			Title:       fiction.Title,
			Authorid:    fiction.Authorid,
			Description: fiction.Description,
			CreatedAt:   fiction.CreatedAt,
			UpdatedAt:   fiction.UpdatedAt,
			PublishedAt: fiction.PublishedAt,
		})
	}
	respondWithJSON(w, http.StatusOK, responseSlice)
}

// Publish Fiction Handler
//
// Publishes the fiction with the provided ID
func (cfg *apiConfig) publishFiction(w http.ResponseWriter, r *http.Request, user database.User) {
	// PROCESS HEADERS
	id := r.PathValue("id")
	if id == "" {
		respondWithError(w, http.StatusBadRequest, "No ID provided")
		return
	}

	// CHECK USER IS AUTHOR
	fiction, err := cfg.DB.GetFictionById(r.Context(), id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't get fiction")
		return
	}
	if fiction.Authorid != user.ID {
		respondWithError(w, http.StatusForbidden, "User is not the author of this fiction")
		return
	}

	// PUBLISH FICTION
	fiction, err = cfg.DB.PublishFiction(r.Context(), database.PublishFictionParams{
		PublishedAt: sql.NullString{
			String: time.Now().UTC().Format(time.RFC3339),
			Valid:  true,
		},
		Published: 1,
		ID:        id,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't publish fiction")
		return
	}

	// RESPONSE
	w.WriteHeader(http.StatusOK)
}

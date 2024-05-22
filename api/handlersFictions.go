package main

import (
	"database/sql"
	"log"
	"net/http"
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
		log.Printf("Error getting fiction: %s", err)
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

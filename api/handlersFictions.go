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

// Post fiction handler
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
		ID:          titleToID(request.Title),
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
		log.Printf("Error creating fiction: %s", err)
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
func titleToID(title string) string {
	// convert title to lowercase
	title = strings.ToLower(title)
	// replace spaces with hyphens
	title = strings.ReplaceAll(title, " ", "-")
	// remove all non-alphanumeric characters
	title = strings.Map(func(r rune) rune {
		if r >= 'a' && r <= 'z' || r >= '0' && r <= '9' || r == '-' {
			return r
		}
		return -1
	}, title)
	// return the first 20 characters
	if len(title) > 20 {
		title = title[:20]
	}

	return title
}

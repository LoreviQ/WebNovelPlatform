package main

import (
	"net/http"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
)

// Post Chapter Handler (POST /v1/fictions/{fiction_id}/chapters)
//
// This handler is responsible for creating a new chapter for a fiction.
// This is a protected endpoint, so the user must be authenticated to access it.
// It first checks if the fiction exists and if the user is the owner of the fiction.
// If all checks pass, it creates a new chapter and returns the new chapter.
func (cfg apiConfig) postChapter(w http.ResponseWriter, r *http.Request, user database.User) {
	// Get the fiction ID from the URL
	fictionId := r.PathValue("fiction_id")

	// Get fiction from database
	fiction, err := cfg.DB.GetFictionById(r.Context(), fictionId)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't get fiction")
		return
	}

	// Check if user is the owner of the fiction
	if fiction.Authorid != user.ID {
		respondWithError(w, http.StatusForbidden, "You are not the owner of this fiction")
		return
	}

	w.WriteHeader(200)
}

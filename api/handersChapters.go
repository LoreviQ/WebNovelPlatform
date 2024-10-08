package main

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/auth"
	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
)

// Post Chapter Handler (POST /v1/fictions/{fiction_id}/chapters)
//
// This handler is responsible for creating a new chapter for a fiction.
// This is a protected endpoint, so the user must be authenticated to access it.
// It checks if the fiction exists and if the user is the owner of the fiction.
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

	// Parse the request body
	request, err := decodeRequest(w, r, struct {
		Title               string `json:"title"`
		Body                string `json:"body"`
		ScheduledAt         string `json:"scheduled_at"`
		PublishImmideiately int64  `json:"publish_immidiately"`
		ChapterNumber       int64  `json:"chapter_number"`
	}{})
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "failed to decode request body")
		return
	}

	// Generate chapter vars
	chapterId, err := auth.GenerateUniqueChapterID(cfg.DB)
	if err != nil {
		log.Printf("Couldn't generate chapter ID: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Couldn't generate chapter ID")
		return
	}
	maxChapter, err := cfg.DB.GetMaxChapterNumber(r.Context(), fictionId)
	if err != nil {
		log.Printf("Couldn't get max chapter number: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Couldn't get max chapter number")
		return
	}
	log.Printf("Max chapter from DB: %v", maxChapter)

	var maxChapterNum int64
	if maxChapter != nil {
		var ok bool
		maxChapterNum, ok = maxChapter.(int64)
		if !ok {
			log.Printf("Unexpected type for maxChapter: %T", maxChapter)
			respondWithError(w, http.StatusInternalServerError, "Couldn't get max chapter number")
			return
		}
	} else {
		maxChapterNum = 0
	}
	log.Printf("Max chapter number: %d", maxChapterNum)

	// Calculate the new chapter number
	newChapterNumber := maxChapterNum + 1
	log.Printf("New chapter number: %d", newChapterNumber)

	// Create the new chapter
	chapter, err := cfg.DB.CreateChapter(r.Context(), database.CreateChapterParams{
		ID:            chapterId,
		ChapterNumber: newChapterNumber,
		FictionID:     fictionId,
		Title:         request.Title,
		Body:          request.Body,
		Published:     request.PublishImmideiately,
		PublishedAt:   sql.NullString{String: time.Now().Format(time.RFC3339), Valid: request.PublishImmideiately == 1},
		ScheduledAt:   sql.NullString{String: request.ScheduledAt, Valid: request.PublishImmideiately != 1},
		CreatedAt:     time.Now().Format(time.RFC3339),
		UpdatedAt:     time.Now().Format(time.RFC3339),
	})
	if err != nil {
		log.Printf("Couldn't create chapter: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Couldn't create chapter")
		return
	}
	respondWithJSON(w, http.StatusCreated, struct {
		ID string `json:"id"`
	}{
		ID: chapter.ID,
	})
}

// Get Chapter Handler (GET /v1/fictions/{fiction_id}/chapters/{chapter_id})
//
// This handler is responsible for getting a specific chapter from a fiction.
// This is a conditionally protected endpoint
//   - If the chapter and fiction is published, it can be accessed by anyone
//   - If the chapter or fiction is not published, the user must be the owner of the fiction to access it
func (cfg apiConfig) getChapter(w http.ResponseWriter, r *http.Request) {
	// Get the fiction ID and chapter ID from the URL
	fictionId := r.PathValue("fiction_id")
	chapterId := r.PathValue("chapter_id")

	// Get chapter from database
	chapter, err := cfg.DB.GetChapterById(r.Context(), chapterId)
	if err == sql.ErrNoRows {
		respondWithError(w, http.StatusNotFound, "Couldn't get chapter")
		return
	} else if err != nil {
		log.Printf("Couldn't get chapter: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Couldn't get chapter")
		return
	}

	// Get fiction from database
	fiction, err := cfg.DB.GetFictionById(r.Context(), fictionId)
	if err == sql.ErrNoRows {
		respondWithError(w, http.StatusNotFound, "Couldn't get fiction")
		return
	} else if err != nil {
		log.Printf("Couldn't get fiction: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Couldn't get fiction")
		return
	}

	// Check if the chapter or fiction is published
	if chapter.Published == 0 || fiction.Published == 0 {
		// Check authoirzation
		user, err := cfg.authenticateRequest(r)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, err.Error())
			return
		}
		if fiction.Authorid != user.ID {
			respondWithError(w, http.StatusForbidden, "This fiction is not published")
			return
		}
	}

	// Respond with chapter
	respondWithJSON(w, http.StatusOK, struct {
		Title       string `json:"title"`
		Body        string `json:"body"`
		Published   int64  `json:"published"`
		PublishedAt string `json:"published_at"`
		Author      string `json:"authorid"`
		NextID      string `json:"next_id"`
		PrevID      string `json:"prev_id"`
	}{
		Title:       chapter.Title,
		Body:        chapter.Body,
		Published:   chapter.Published,
		PublishedAt: chapter.PublishedAt.String,
		Author:      fiction.Authorid,
		NextID:      chapter.NextID.(string),
		PrevID:      chapter.PreviousID.(string),
	})
}

// Get Chapters Handler (GET /v1/fictions/{fiction_id}/chapters/)
//
// This handler is responsible for getting all chapters from a fiction available to the user.
// This is a conditionally protected endpoint
//   - If the fiction is published, it can be accessed by anyone
//   - If the fiction is not published, the user must be the owner of the fiction to access it
//   - The function will only return the chapters that are published unless the user is the owner of the fiction
func (cfg apiConfig) getChapters(w http.ResponseWriter, r *http.Request) {
	// Get the fiction ID from the URL
	fictionId := r.PathValue("fiction_id")

	// Get fiction from database
	fiction, err := cfg.DB.GetFictionById(r.Context(), fictionId)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't get fiction")
		return
	}

	// Check authoirzation
	user, authErr := cfg.authenticateRequest(r)
	owner := fiction.Authorid == user.ID

	// Check if the fiction is published
	if fiction.Published == 0 {
		// Check authoirzation
		if authErr != nil {
			respondWithError(w, http.StatusUnauthorized, authErr.Error())
			return
		}
		if !owner {
			respondWithError(w, http.StatusForbidden, "This fiction is not published")
			return
		}
	}

	// Get chapters from database
	chapters, err := cfg.DB.GetChaptersByFictionId(r.Context(), database.GetChaptersByFictionIdParams{
		FictionID: fictionId,
		Limit:     20,
		Offset:    0,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't get chapters")
		return
	}

	// Filter out unpublished chapters if user is not the owner
	if !owner {
		filteredChapters := make([]database.Chapter, 0, len(chapters))
		for _, chapter := range chapters {
			if chapter.Published == 1 {
				filteredChapters = append(filteredChapters, chapter)
			}
		}
		chapters = filteredChapters
	}

	// Respond with chapters
	type chapterResponse struct {
		ID            string `json:"id"`
		ChapterNumber int64  `json:"chapter_number"`
		Title         string `json:"title"`
		Published     int64  `json:"published"`
		PublishedAt   string `json:"published_at"`
		ScheduledAt   string `json:"scheduled_at"`
	}
	responseSlice := make([]chapterResponse, 0, len(chapters))
	for _, chapter := range chapters {
		responseSlice = append(responseSlice, chapterResponse{
			ID:            chapter.ID,
			ChapterNumber: chapter.ChapterNumber,
			Title:         chapter.Title,
			Published:     chapter.Published,
			PublishedAt:   chapter.PublishedAt.String,
			ScheduledAt:   chapter.ScheduledAt.String,
		})
	}
	respondWithJSON(w, http.StatusOK, responseSlice)
}

// Put Chapter Handler (PUT /v1/fictions/{fiction_id}/chapters/{chapter_id})
//
// This handler is responsible for updating a specific chapter from a fiction.
// This is a protected endpoint, so the user must be authenticated to access it.
func (cfg apiConfig) putChapter(w http.ResponseWriter, r *http.Request, user database.User) {
	// Get the fiction ID and chapter ID from the URL
	fictionId := r.PathValue("fiction_id")
	chapterId := r.PathValue("chapter_id")

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

	// Get chapter from database
	chapter, err := cfg.DB.GetChapterById(r.Context(), chapterId)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't get chapter")
		return
	}

	// Parse the request body
	request, err := decodeRequest(w, r, struct {
		Title     string `json:"title"`
		Body      string `json:"body"`
		Published *int64 `json:"published"`
	}{})
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "failed to decode request body")
		return
	}
	// Use original values if request fields are empty or nil
	title := chapter.Title
	if request.Title != "" {
		title = request.Title
	}

	body := chapter.Body
	if request.Body != "" {
		body = request.Body
	}

	published := chapter.Published
	if request.Published != nil {
		published = *request.Published
	}

	// Generate chapter vars
	var publishedAt sql.NullString
	if request.Published != nil && chapter.Published == 0 && *request.Published == 1 {
		publishedAt = sql.NullString{String: time.Now().Format(time.RFC3339), Valid: true}
	} else {
		publishedAt = chapter.PublishedAt
	}

	// Update the chapter
	_, err = cfg.DB.UpdateChapter(r.Context(), database.UpdateChapterParams{
		ID:          chapter.ID,
		Title:       title,
		Body:        body,
		Published:   published,
		PublishedAt: publishedAt,
		UpdatedAt:   time.Now().Format(time.RFC3339),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't update chapter")
		return
	}

	// Respond with success
	respondWithJSON(w, http.StatusOK, struct {
		ID string `json:"id"`
	}{
		ID: chapter.ID,
	})
}

// Delete Chapter Handler (DELETE /v1/fictions/{fiction_id}/chapters/{chapter_id})
//
// This handler is responsible for deleting a specific chapter from a fiction.
// This is a protected endpoint, so the user must be authenticated to access it.
func (cfg apiConfig) deleteChapter(w http.ResponseWriter, r *http.Request, user database.User) {
	// Get the fiction ID and chapter ID from the URL
	fictionId := r.PathValue("fiction_id")
	chapterId := r.PathValue("chapter_id")

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

	// Delete the chapter
	err = cfg.DB.DeleteChapter(r.Context(), chapterId)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't delete chapter")
		return
	}

	// Respond with success
	w.WriteHeader(http.StatusOK)
}

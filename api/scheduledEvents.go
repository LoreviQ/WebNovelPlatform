package main

import (
	"context"
	"database/sql"
	"log"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
)

// eventChecker is a function periodically runs a check for scheduled events in a go routine
func (cfg apiConfig) startScheduledEventChecker() {
	ticker := time.NewTicker(1 * time.Minute)
	go func() {
		for range ticker.C {
			cfg.checkAndCompleteScheduledEvents()
		}
	}()
}

// checkAndCompleteScheduledEvents checks for any scheduled events and completes them
func (cfg apiConfig) checkAndCompleteScheduledEvents() {
	//events
	err := publishScheduledChpaters(cfg.DB)
	if err != nil {
		log.Printf("Error publishing scheduled chapters: %v\n", err)
	}
}

// publishScheduledChpaters publishes any chapters that are scheduled to be published
func publishScheduledChpaters(db *database.Queries) error {
	chapters, err := db.GetScheduledChaptersToPublish(context.Background(), sql.NullString{String: time.Now().Format(time.RFC3339), Valid: true})
	if err != nil {
		return err
	}
	for _, chapter := range chapters {
		_, err := db.UpdateChapter(context.Background(), database.UpdateChapterParams{
			ChapterNumber: chapter.ChapterNumber,
			UpdatedAt:     time.Now().Format(time.RFC3339),
			Title:         chapter.Title,
			Body:          chapter.Body,
			Published:     1,
			PublishedAt:   sql.NullString{String: time.Now().Format(time.RFC3339), Valid: true},
			ScheduledAt:   sql.NullString{String: "", Valid: false},
			ID:            chapter.ID,
		})
		if err != nil {
			return err
		}
	}
	return nil
}

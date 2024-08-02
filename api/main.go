package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
	"github.com/joho/godotenv"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

type apiConfig struct {
	port       string
	DB         *database.Queries
	JWT_Secret []byte
}

func main() {
	cfg := setupConfig()
	server := initialiseServer(cfg, http.NewServeMux())
	// Serve Server
	log.Printf("Serving on port: %s\n", cfg.port)
	log.Panic(server.ListenAndServe())
}

func setupConfig() apiConfig {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Assuming default configuration - .env unreadable: %v", err)
	}
	envs := []string{"PORT", "DB_CONNECTION"}
	for _, env := range envs {
		if os.Getenv(env) == "" {
			log.Fatalf("Environment variable %s is not set", env)
		}
	}
	db, err := sql.Open("libsql", os.Getenv("DB_CONNECTION"))
	if err != nil {
		log.Panicf("Error connecting to DB: %s\n", err)
	}
	return apiConfig{
		port:       os.Getenv("PORT"),
		DB:         database.New(db),
		JWT_Secret: []byte(os.Getenv("JWT_SECRET")),
	}
}

// initialiseServer creates a new http server with the provided configuration
func initialiseServer(cfg apiConfig, mux *http.ServeMux) *http.Server {
	mux.HandleFunc("GET /v1/readiness", cfg.getReadiness)

	// Auth Endpoints
	mux.HandleFunc("GET /v1/login", cfg.AuthMiddleware(cfg.getLogin))
	mux.HandleFunc("POST /v1/login", cfg.postLogin)
	mux.HandleFunc("GET /v1/refresh", cfg.getRefresh)
	mux.HandleFunc("POST /v1/refresh", cfg.postRefresh)
	mux.HandleFunc("POST /v1/revoke", cfg.postRevoke)

	// User Endpoints
	mux.HandleFunc("POST /v1/users", cfg.postUser)
	mux.HandleFunc("PUT /v1/users", cfg.AuthMiddleware(cfg.putUser))
	mux.HandleFunc("GET /v1/users/{id}", cfg.getUser)
	mux.HandleFunc("PUT /v1/users/profile", cfg.AuthMiddleware(cfg.putUserProfile))
	mux.HandleFunc("GET /v1/users/{id}/fictions", cfg.getFictionsByUser)
	mux.HandleFunc("GET /v1/users/me/fictions", cfg.AuthMiddleware(cfg.getMyFictions))

	// Fiction Endpoints
	mux.HandleFunc("GET /v1/fictions", cfg.getFictions)
	mux.HandleFunc("POST /v1/fictions", cfg.AuthMiddleware(cfg.postFiction))
	mux.HandleFunc("GET /v1/fictions/{id}", cfg.IsPublishedMiddleware(cfg.getFiction))
	mux.HandleFunc("PUT /v1/fictions/{id}", cfg.AuthMiddleware(cfg.putFiction))
	mux.HandleFunc("DELETE /v1/fictions/{id}", cfg.AuthMiddleware(cfg.deleteFiction))
	mux.HandleFunc("PUT /v1/fictions/{id}/publish", cfg.AuthMiddleware(cfg.publishFiction))

	// Chapter Endpoints
	mux.HandleFunc("POST /v1/fictions/{fiction_id}/chapters", cfg.AuthMiddleware(cfg.postChapter))
	mux.HandleFunc("GET /v1/fictions/{fiction_id}/chapters", cfg.getChapters)
	mux.HandleFunc("GET /v1/fictions/{fiction_id}/chapters/{chapter_id}", cfg.getChapter)
	mux.HandleFunc("PUT /v1/fictions/{fiction_id}/chapters/{chapter_id}", cfg.AuthMiddleware(cfg.putChapter))
	mux.HandleFunc("DELETE /v1/fictions/{fiction_id}/chapters/{chapter_id}", cfg.AuthMiddleware(cfg.deleteChapter))

	// GCS Endpoints
	mux.HandleFunc("POST /v1/gcs-signed-url", cfg.AuthMiddleware(cfg.postSignedURL))

	corsMux := cfg.CorsMiddleware(mux)

	server := &http.Server{
		Addr:              ":" + cfg.port,
		Handler:           corsMux,
		ReadHeaderTimeout: 10 * time.Second,
	}
	return server
}

package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type apiConfig struct {
	port string
	DB   *database.Queries
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
		log.Panicf("Error loading .env file: %s\n", err)
	}
	db, err := sql.Open("postgres", os.Getenv("DB_CONNECTION"))
	if err != nil {
		log.Panicf("Error connecting to DB: %s\n", err)
	}
	return apiConfig{
		port: os.Getenv("PORT"),
		DB:   database.New(db),
	}
}

// initialiseServer creates a new http server with the provided configuration
func initialiseServer(cfg apiConfig, mux *http.ServeMux) *http.Server {
	mux.HandleFunc("GET /v1/readiness", cfg.getReadiness)
	mux.HandleFunc("POST /v1/users", cfg.postUser)

	server := &http.Server{
		Addr:              ":" + cfg.port,
		Handler:           mux,
		ReadHeaderTimeout: 10 * time.Second,
	}
	return server
}

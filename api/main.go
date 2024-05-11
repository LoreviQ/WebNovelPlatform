package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

type apiConfig struct {
	port string
}

func main() {
	godotenv.Load()
	// Setup Config
	cfg := apiConfig{
		port: os.Getenv("PORT"),
	}
	// Initialise Server
	server := initialiseServer(cfg, http.NewServeMux())
	// Serve Server
	log.Printf("Serving on port: %s\n", cfg.port)
	log.Panic(server.ListenAndServe())
}

func initialiseServer(cfg apiConfig, mux *http.ServeMux) *http.Server {
	mux.HandleFunc("GET /v1/readiness", cfg.getReadiness)

	server := &http.Server{
		Addr:    ":" + cfg.port,
		Handler: mux,
	}
	return server
}

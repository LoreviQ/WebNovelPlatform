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
	err := godotenv.Load()
	port := os.Getenv("PORT")
	if err != nil {
		port = "8080"
		log.Printf("Error loading .env file: %s\n", err)
	}
	// Setup Config
	cfg := apiConfig{
		port: port,
	}
	// Initialise Server
	server := initialiseServer(cfg, http.NewServeMux())
	// Serve Server
	log.Printf("Serving on port: %s\n", cfg.port)
	log.Panic(server.ListenAndServe())
}

// initialiseServer creates a new http server with the provided configuration
func initialiseServer(cfg apiConfig, mux *http.ServeMux) *http.Server {
	mux.HandleFunc("GET /v1/readiness", cfg.getReadiness)

	server := &http.Server{
		Addr:    ":" + cfg.port,
		Handler: mux,
	}
	return server
}

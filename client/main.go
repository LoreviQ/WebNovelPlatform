package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	cp "github.com/otiai10/copy"
)

type apiConfig struct {
	port string
}

func main() {
	cfg := setupConfig()
	generatePublicFiles()
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
	envs := []string{"PORT"}
	for _, env := range envs {
		if os.Getenv(env) == "" {
			log.Fatalf("Environment variable %s is not set", env)
		}
	}
	return apiConfig{
		port: os.Getenv("PORT"),
	}
}

// Recursively copies all files from the static directory to the public directory
func generatePublicFiles() {
	err := cp.Copy("static", "public")
	if err != nil {
		log.Printf("Error copying static files: %s", err)
	}
}

// initialiseServer creates a new http server with the provided configuration
func initialiseServer(cfg apiConfig, mux *http.ServeMux) *http.Server {
	mux.HandleFunc("GET /", cfg.getPage("public/index.html"))

	server := &http.Server{
		Addr:              ":" + cfg.port,
		Handler:           mux,
		ReadHeaderTimeout: 10 * time.Second,
	}
	return server
}

func (cfg *apiConfig) getPage(page string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, page)
	}
}

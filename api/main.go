package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	log.Printf("Serving on port: %s\n", os.Getenv("PORT"))
}

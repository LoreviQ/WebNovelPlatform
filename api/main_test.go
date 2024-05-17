package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"testing"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

func TestReadiness(t *testing.T) {
	// Test the GET /v1/readiness endpoint
	// Create a new request to the /v1/readiness endpoint
	// Send the request
	// Check the response status code is 200
	// Check the response body is "OK"

	// Initialise Server
	cfg := setupConfigTest()
	server := initialiseServer(cfg, http.NewServeMux())
	go server.ListenAndServe()
	defer server.Close()

	// Create a new request to the /v1/readiness endpoint
	res := &http.Response{}
	var err error
	requestURL := fmt.Sprintf("http://localhost:%s/v1/readiness", cfg.port)
	for i := 0; i < 5; i++ {
		fmt.Printf("Attempt %d\n", i+1)
		err = nil
		req, err := http.NewRequest(http.MethodGet, requestURL, nil)
		if err != nil {
			t.Fatalf("client: could not create request: %s\n", err)
		}
		res, err = http.DefaultClient.Do(req)
		if err != nil {
			fmt.Printf("could not send request: %v\n", err)
		}
		time.Sleep(time.Millisecond * 100)
		if err == nil {
			break
		}
	}
	if err != nil {
		t.Fatalf("could not send request: %v\n", err)
	}

	// Compare Response
	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected status code 200, got %d", res.StatusCode)
	}
	var response struct {
		Status string `json:"status"`
	}
	err = json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if response.Status != "ok" {
		t.Fatalf("expected response body \"OK\", got %q", response)
	}
}

func TestPostUser(t *testing.T) {
	// Test the POST /v1/users endpoint
	// Create a new request to the /v1/users endpoint
	// Send the request
	// Check the response status code is 200
	// Check the response body matches the created user

	// Initialise Server

	cfg := setupConfigTest()
	server := initialiseServer(cfg, http.NewServeMux())
	go server.ListenAndServe()
	defer server.Close()

	// JSON body
	body := []byte(`{
		"name": "Test User",
		"email": "test@test.com",
		"password": "password"
	}`)

	// Create a new request to the /v1/users endpoint
	res := &http.Response{}
	var err error
	requestURL := fmt.Sprintf("http://localhost:%s/v1/users", cfg.port)
	for i := 0; i < 5; i++ {
		fmt.Printf("Attempt %d\n", i+1)
		err = nil
		req, err := http.NewRequest(http.MethodPost, requestURL, bytes.NewBuffer(body))
		if err != nil {
			t.Fatalf("client: could not create request: %s\n", err)
		}
		res, err = http.DefaultClient.Do(req)
		if err != nil {
			fmt.Printf("could not send request: %v\n", err)
		}
		time.Sleep(time.Millisecond * 100)
		if err == nil {
			break
		}
	}
	if err != nil {
		t.Fatalf("could not send request: %v\n", err)
	}

	// Compare Response
	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected status code 200, got %d", res.StatusCode)
	}
	var response struct {
		ID        uuid.UUID `json:"id"`
		CreatedAt time.Time `json:"created_at"`
		UpdatedAt time.Time `json:"updated_at"`
		Name      string    `json:"name"`
		Email     string    `json:"email"`
	}
	err = json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if response.Name != "Test User" {
		t.Fatalf("expected response body \"OK\", got %q", response)
	}
}

func setupConfigTest() apiConfig {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Assuming default configuration - .env unreadable: %v", err)
	}
	db, err := sql.Open("libsql", os.Getenv("DB_CONNECTION_TEST"))
	if err != nil {
		log.Panicf("Error connecting to DB: %s\n", err)
	}
	// empty DB from previous tests
	var tables = []string{
		"users",
	}
	for _, table := range tables {
		_, err := db.Exec(fmt.Sprintf("DELETE FROM %s;", table))
		if err != nil {
			log.Panicf("failed to truncate table %s", err)
		}
	}
	return apiConfig{
		port:       "8080",
		DB:         database.New(db),
		JWT_Secret: []byte(os.Getenv("JWT_SECRET")),
	}
}

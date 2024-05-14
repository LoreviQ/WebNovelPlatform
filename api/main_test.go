package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/google/uuid"
)

func TestReadiness(t *testing.T) {
	// Test the GET /v1/readiness endpoint
	// Create a new request to the /v1/readiness endpoint
	// Send the request
	// Check the response status code is 200
	// Check the response body is "OK"

	// Initialise Server
	cfg := setupConfig()
	server := initialiseServer(cfg, http.NewServeMux())
	go server.ListenAndServe()
	defer server.Close()

	// Create a new request to the /v1/readiness endpoint
	res := &http.Response{}
	requestURL := fmt.Sprintf("http://localhost:%s/v1/readiness", cfg.port)
	var err error
	for i := 0; i < 5; i++ {
		fmt.Printf("Attempt %d\n", i)
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
	cfg := setupConfig()
	server := initialiseServer(cfg, http.NewServeMux())
	go server.ListenAndServe()
	defer server.Close()

	// JSON body
	body := []byte(`{
		"name": "Test User"
	}`)

	// Create a new request to the /v1/users endpoint
	res := &http.Response{}
	requestURL := fmt.Sprintf("http://localhost:%s/v1/users", cfg.port)
	var err error
	for i := 0; i < 5; i++ {
		fmt.Printf("Attempt %d\n", i)
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
	}
	err = json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if response.Name != "Test User" {
		t.Fatalf("expected response body \"OK\", got %q", response)
	}
}

package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"testing"
)

func TestEndpoints(t *testing.T) {
	// Initialises the server then sequentially tests the endpoints
	teardownTest := setupTest()
	defer teardownTest()

	t.Run("getFictions", testGetFictions)
}

func testGetFictions(t *testing.T) {
	// Test the GET /v1/fictions endpoint

	// Create a new request to the /v1/fictions endpoint
	requestURL := "http://localhost:8080/v1/fictions"
	res := loopSendRequest(requestURL, http.MethodGet, nil, nil, t)

	// Compare Response
	if res.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, res.StatusCode)
	}

	type response struct {
		ID          string         `json:"id"`
		Title       string         `json:"title"`
		Authorid    string         `json:"authorid"`
		Description string         `json:"description"`
		CreatedAt   string         `json:"created_at"`
		UpdatedAt   string         `json:"updated_at"`
		PublishedAt sql.NullString `json:"published_at"`
	}
	responseSlice := make([]response, 0, 20)
	err := json.NewDecoder(res.Body).Decode(&responseSlice)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
}

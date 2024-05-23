package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
)

func TestEndpoints(t *testing.T) {
	// Initialises the server then sequentially tests the endpoints
	teardownTest := setupTest()
	defer teardownTest()

	t.Run("getFictions", testGetFictions)
	//t.Run("getFiction", testGetFiction)

	t.Run("postFiction", func(t *testing.T) {
		testPostUser(t)
		accessToken, _ := testPostLogin(t)
		testPostFiction(t, accessToken)
	})
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

func testGetFiction(t *testing.T) {
	// Test the GET /v1/fictions/{id} endpoint

	// Create a new request to the /v1/fictions/{id} endpoint
	requestURL := "http://localhost:8080/v1/fictions/1"
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
	var resBody response
	err := json.NewDecoder(res.Body).Decode(&resBody)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
}

func testPostFiction(t *testing.T, accessToken string) {
	// Test the POST /v1/fictions endpoint

	// Create a new request to the /v1/fictions endpoint
	body := bytes.NewBuffer([]byte(`{
		"Title": "The Great Gatsby",
		"Description": "A book about a rich guy and his obseeive love"
		}`))

	requestURL := "http://localhost:8080/v1/fictions"
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", accessToken),
	}
	res := loopSendRequest(requestURL, http.MethodPost, body, headers, t)

	// Compare Response
	if res.StatusCode != http.StatusCreated {
		t.Errorf("Expected status code %d, got %d", http.StatusCreated, res.StatusCode)
	}
	var response struct {
		ID          string `json:"id"`
		Title       string `json:"title"`
		Authorid    string `json:"authorid"`
		Description string `json:"description"`
		CreatedAt   string `json:"created_at"`
	}
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if response.ID != "the-great-gatsby" {
		t.Errorf("expected ID the-great-gatsby, got %s", response.ID)
	}
	if response.Title != "The Great Gatsby" {
		t.Errorf("expected title The Great Gatsby, got %s", response.Title)
	}
}

func TestTitleToId(t *testing.T) {
	// Test the titleToId function
	tests := []struct {
		name       string
		title      string
		expectedID string
	}{
		{name: "simple", title: "The Great Gatsby", expectedID: "the-great-gatsby"},
		{name: "complex", title: "The Great Gatsby: Part 2", expectedID: "the-great-gatsby-par"},
		{name: "empty", title: "", expectedID: ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			id := titleToID(tt.title)
			if id != tt.expectedID {
				t.Errorf("expected %s, got %s", tt.expectedID, id)
			}
		})
	}
}

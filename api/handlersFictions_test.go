package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"
)

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
	requestURL := "http://localhost:8080/v1/fictions/the-great-gatsby"
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
	if resBody.ID != "the-great-gatsby" {
		t.Errorf("expected ID the-great-gatsby, got %s", resBody.ID)
	}
	if resBody.Title != "The Great Gatsby" {
		t.Errorf("expected title The Great Gatsby, got %s", resBody.Title)
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
			id := urlify(tt.title)
			if id != tt.expectedID {
				t.Errorf("expected %s, got %s", tt.expectedID, id)
			}
		})
	}
}

func testPutFiction(t *testing.T, accessToken string) {
	// Test the PUT /v1/fictions/{id} endpoint

	// Create a new request to the /v1/fictions/{id} endpoint
	body := bytes.NewBuffer([]byte(`{
		"Title": "The Great Gatsby: Part 2",
		"Description": "A book about a rich guy and his obsessive love"
		}`))

	requestURL := "http://localhost:8080/v1/fictions/the-great-gatsby"
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", accessToken),
	}
	res := loopSendRequest(requestURL, http.MethodPut, body, headers, t)

	// Compare Response
	if res.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, res.StatusCode)
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
	if response.ID != "the-great-gatsby-par" {
		t.Errorf("expected ID the-great-gatsby-par, got %s", response.ID)
	}
	if response.Title != "The Great Gatsby: Part 2" {
		t.Errorf("expected title The Great Gatsby: Part 2, got %s", response.Title)
	}
}

func testDeleteFiction(t *testing.T, accessToken string) {
	// Test the DELETE /v1/fictions/{id} endpoint

	// Create a new request to the /v1/fictions/{id} endpoint
	requestURL := "http://localhost:8080/v1/fictions/the-great-gatsby-par"
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", accessToken),
	}
	res := loopSendRequest(requestURL, http.MethodDelete, nil, headers, t)

	// Compare Response
	if res.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, res.StatusCode)
	}
}

func testGetFictionFail(t *testing.T) {
	// Test the GET /v1/fictions/{id} endpoint
	// Expected to fail since fiction has been deleted by testDeleteFiction

	// Create a new request to the /v1/fictions/{id} endpoint
	requestURL := "http://localhost:8080/v1/fictions/the-great-gatsby"
	res := loopSendRequest(requestURL, http.MethodGet, nil, nil, t)

	// Compare Response
	if res.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d, got %d", http.StatusInternalServerError, res.StatusCode)
	}

	type response struct {
		Error string `json:"error"`
	}
	var resBody response
	err := json.NewDecoder(res.Body).Decode(&resBody)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if resBody.Error != "Couldn't get fiction" {
		t.Errorf("expected error Couldn't get fiction, got %s", resBody.Error)
	}
}

func testDeleteFictionFail(t *testing.T) {
	// Test the DELETE /v1/fictions/{id} endpoint
	// Expected to fail since the user is not the author of the fiction

	// Create a new user and log in as them
	body := bytes.NewBuffer([]byte(`{
		"name": "Fail User",
		"email": "fail@test.com",
		"password": "password"
	}`))
	loopSendRequest("http://localhost:8080/v1/users", http.MethodPost, body, nil, t)
	body = bytes.NewBuffer([]byte(`{
		"email": "fail@test.com",
		"password": "password"
	}`))
	res := loopSendRequest("http://localhost:8080/v1/login", http.MethodPost, body, nil, t)
	var responseAuth struct {
		UserData struct {
			ID    string `json:"id"`
			Name  string `json:"name"`
			Email string `json:"email"`
		} `json:"user"`
		AuthData struct {
			AccessToken struct {
				Token   string    `json:"token"`
				Expires time.Time `json:"expires"`
			} `json:"access"`
			RefreshToken struct {
				Token   string    `json:"token"`
				Expires time.Time `json:"expires"`
			} `json:"refresh"`
		} `json:"auth"`
	}
	err := json.NewDecoder(res.Body).Decode(&responseAuth)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}

	// Create a new request to the /v1/fictions/{id} endpoint
	requestURL := "http://localhost:8080/v1/fictions/the-great-gatsby"
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", responseAuth.AuthData.AccessToken.Token),
	}
	res = loopSendRequest(requestURL, http.MethodDelete, nil, headers, t)

	// Compare Response
	if res.StatusCode != http.StatusForbidden {
		t.Errorf("Expected status code %d, got %d", http.StatusForbidden, res.StatusCode)
	}

	var responseErr struct {
		Error string `json:"error"`
	}
	err = json.NewDecoder(res.Body).Decode(&responseErr)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if responseErr.Error != "User is not the author of this fiction" {
		t.Errorf("expected error %s, got %s", "User is not the author of this fiction", responseErr.Error)
	}

}

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"
)

func setupChapterTests(t *testing.T) string {
	// Create a user
	body := bytes.NewBuffer([]byte(`{
		"name": "Chapter Test User",
		"email": "chapters@test.com",
		"password": "chapters"
	}`))
	requestURL := "http://localhost:8080/v1/users"
	res := loopSendRequest(requestURL, http.MethodPost, body, nil, t)
	if res.StatusCode != http.StatusCreated {
		t.Fatal("failed to setup chapter tests")
	}

	// login as the user
	body = bytes.NewBuffer([]byte(`{
		"email": "chapters@test.com",
		"password": "chapters"
	}`))
	requestURL = "http://localhost:8080/v1/login"
	res = loopSendRequest(requestURL, http.MethodPost, body, nil, t)
	if res.StatusCode != http.StatusOK {
		t.Fatal("failed to setup chapter tests")
	}
	var response struct {
		UserData struct {
			ID   string `json:"id"`
			Name string `json:"name"`
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
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	accessToken := response.AuthData.AccessToken.Token

	// Create a fiction
	body = bytes.NewBuffer([]byte(`{
		"Title": "The Chapters",
		"Description": "A book that tests chapters"
		}`))
	requestURL = "http://localhost:8080/v1/fictions"
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", accessToken),
	}
	res = loopSendRequest(requestURL, http.MethodPost, body, headers, t)
	if res.StatusCode != http.StatusCreated {
		t.Fatal("failed to setup chapter tests")
	}

	// Publish the fiction
	requestURL = "http://localhost:8080/v1/fictions/the-chapters/publish"
	res = loopSendRequest(requestURL, http.MethodPut, nil, headers, t)
	if res.StatusCode != http.StatusOK {
		t.Fatal("failed to setup chapter tests")
	}
	return accessToken
}

// Test the POST /v1/fictions/{fiction_id}/chapters endpoint
func testPostChapter(t *testing.T, accessToken string) (string, string) {
	// Create and send request for chapter 1
	body := bytes.NewBuffer([]byte(`{
		"title": "Chapter 1",
		"body": "This is the first chapter",
		"published": 1
	}`))
	requestURL := "http://localhost:8080/v1/fictions/the-chapters/chapters"
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", accessToken),
	}
	res := loopSendRequest(requestURL, http.MethodPost, body, headers, t)
	if res.StatusCode != http.StatusCreated {
		t.Errorf("Expected status code %d, got %d", http.StatusCreated, res.StatusCode)
	}
	var response struct {
		ID string `json:"id"`
	}
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	id1 := response.ID

	// Create and send request for chapter 2
	body = bytes.NewBuffer([]byte(`{
		"title": "Chapter 2",
		"body": "This is the second chapter",
		"published": 0
	}`))
	res = loopSendRequest(requestURL, http.MethodPost, body, headers, t)
	if res.StatusCode != http.StatusCreated {
		t.Errorf("Expected status code %d, got %d", http.StatusCreated, res.StatusCode)
	}
	err = json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	id2 := response.ID
	return id1, id2
}

// Test the GET /v1/fictions/{fiction_id}/chapters/{chapter_id} endpoint
func testGetChapter(t *testing.T, id string) {
	// Get the first chapter
	requestURL := fmt.Sprintf("http://localhost:8080/v1/fictions/the-chapters/chapters/%s", id)
	res := loopSendRequest(requestURL, http.MethodGet, nil, nil, t)
	if res.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, res.StatusCode)
	}
	var response struct {
		Title       string `json:"title"`
		Body        string `json:"body"`
		Published   int64  `json:"published"`
		PublishedAt string `json:"published_at"`
	}
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if response.Title != "Chapter 1" {
		t.Errorf("Expected title %s, got %s", "Chapter 1", response.Title)
	}
	if response.Body != "This is the first chapter" {
		t.Errorf("Expected body %s, got %s", "This is the first chapter", response.Body)
	}
	if response.Published != 1 {
		t.Errorf("Expected published %d, got %d", 1, response.Published)
	}
}

// Test getting an unpublished chapter from the GET /v1/fictions/{fiction_id}/chapters/{chapter_id} endpoint
func testGetUnpublishedChapter(t *testing.T, id, accessToken string) {
	// Get the second chapter
	requestURL := fmt.Sprintf("http://localhost:8080/v1/fictions/the-chapters/chapters/%s", id)
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", accessToken),
	}
	res := loopSendRequest(requestURL, http.MethodGet, nil, headers, t)
	if res.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, res.StatusCode)
	}
	var response struct {
		Title       string `json:"title"`
		Body        string `json:"body"`
		Published   int64  `json:"published"`
		PublishedAt string `json:"published_at"`
	}
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if response.Title != "Chapter 2" {
		t.Errorf("Expected title %s, got %s", "Chapter 2", response.Title)
	}
	if response.Body != "This is the second chapter" {
		t.Errorf("Expected body %s, got %s", "This is the second chapter", response.Body)
	}
	if response.Published != 0 {
		t.Errorf("Expected published %d, got %d", 0, response.Published)
	}
}

// Test the GET /v1/fictions/{fiction_id}/chapters endpoint
func testGetChapters(t *testing.T, accessToken string) {
	// Get all chapters
	requestURL := "http://localhost:8080/v1/fictions/the-chapters/chapters"
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", accessToken),
	}
	res := loopSendRequest(requestURL, http.MethodGet, nil, headers, t)
	if res.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, res.StatusCode)
	}
	var response []struct {
		ID          string `json:"id"`
		Title       string `json:"title"`
		Published   int64  `json:"published"`
		PublishedAt string `json:"published_at"`
	}
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if len(response) != 2 {
		t.Errorf("Expected 2 chapters, got %d", len(response))
	}
}

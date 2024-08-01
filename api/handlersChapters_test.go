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
	return accessToken
}

// Test the POST /v1/fictions/{fiction_id}/chapters endpoint
func testPostChapter(t *testing.T, accessToken string) {
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
}

package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"testing"
	"time"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/auth"
	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

func TestServerEndpoints(t *testing.T) {
	// Initialises the server then sequentially tests the endpoints
	teardownTest := setupTest()
	defer teardownTest()

	t.Run("TEST: GET /v1/readiness", testReadiness)
	t.Run("TEST: POST /v1/users", testPostUser)
	t.Run("TEST: POST /v1/login", func(t *testing.T) {
		testPostLogin(t)
	})
	t.Run("TEST: PUT /v1/users", func(t *testing.T) {
		accessToken := testPostLogin(t)
		testPutUser(t, accessToken)
	})
	t.Run("TEST: PUT /v1/users (fail)", func(t *testing.T) {
		accessToken := testPostLogin(t)
		time.Sleep(time.Second * 16)
		testPutUserFail(t, accessToken)
	})
}

func testReadiness(t *testing.T) {
	// Test the GET /v1/readiness endpoint
	// Create a new request to the /v1/readiness endpoint
	// Send the request
	// Check the response status code is 200
	// Check the response body is "OK"

	// Create a new request to the /v1/readiness endpoint
	requestURL := "http://localhost:8080/v1/readiness"
	res := loopSendRequest(requestURL, http.MethodGet, nil, nil, t)

	// Compare Response
	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected status code 200, got %d", res.StatusCode)
	}
	var response struct {
		Status string `json:"status"`
	}
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if response.Status != "ok" {
		t.Fatalf("expected response body \"OK\", got %q", response)
	}
}

func testPostUser(t *testing.T) {
	// Test the POST /v1/users endpoint
	// Create a new request to the /v1/users endpoint
	// Send the request
	// Check the response status code is 200
	// Check the response body matches the created user

	// JSON body
	body := bytes.NewBuffer([]byte(`{
		"name": "Test User",
		"email": "test@test.com",
		"password": "password"
	}`))

	// Create a new request to the POST /v1/users endpoint
	requestURL := "http://localhost:8080/v1/users"
	res := loopSendRequest(requestURL, http.MethodPost, body, nil, t)

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
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if response.Name != "Test User" {
		t.Fatalf("expected name \"Test User\", got %q", response)
	}
}

func testPostLogin(t *testing.T) string {
	// Test the POST /v1/login endpoint
	// Create a new request to the /v1/login endpoint
	// Send the request
	// Check the response status code is 200
	// Check the response body matches the loged in user and an access token is returned

	// Create a new request to the POST /v1/login endpoint
	body := []byte(`{
		"email": "test@test.com",
		"password": "password"
		}`)
	requestURL := "http://localhost:8080/v1/login"
	res := loopSendRequest(requestURL, http.MethodPost, bytes.NewBuffer(body), nil, t)

	// Compare Response
	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected status code 200, got %d", res.StatusCode)
	}
	var response struct {
		ID          uuid.UUID `json:"id"`
		Email       string    `json:"email"`
		AccessToken string    `json:"token"`
	}
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if response.Email != "test@test.com" {
		t.Fatalf("expected response body \"OK\", got %q", response)
	}
	if response.AccessToken == "" {
		t.Fatalf("expected access token, got %q", response.AccessToken)
	}
	return response.AccessToken
}

func testPutUser(t *testing.T, accessToken string) {
	// Test the PUT /v1/users endpoint
	// Create a new request to the /v1/users endpoint
	// Send the request
	// Check the response status code is 200
	// Check the response body matches the updated user

	// JSON body
	body := []byte(`{
		"name": "Updated User",
		"email": "test@test.com",
		"password": "password"
	}`)
	requestURL := "http://localhost:8080/v1/users"
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", accessToken),
	}
	res := loopSendRequest(requestURL, http.MethodPut, bytes.NewBuffer(body), headers, t)

	// Compare Response
	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected status code 200, got %d", res.StatusCode)
	}
	var response struct {
		ID        string `json:"id"`
		CreatedAt string `json:"created_at"`
		UpdatedAt string `json:"updated_at"`
		Name      string `json:"name"`
		Email     string `json:"email"`
	}
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if response.Name != "Updated User" {
		t.Fatalf("expected name \"Updated User\", got %q", response)
	}
}

func testPutUserFail(t *testing.T, accessToken string) {
	// Test the PUT /v1/users endpoint
	// Same as above but expecting it to fail since the access token has expired

	// JSON body
	body := []byte(`{
		"name": "Updated User 2",
		"email": "test@test.com",
		"password": "password"
	}`)
	requestURL := "http://localhost:8080/v1/users"
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", accessToken),
	}
	res := loopSendRequest(requestURL, http.MethodPut, bytes.NewBuffer(body), headers, t)

	// Compare Response
	if res.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected status code 401, got %d", res.StatusCode)
	}
	var response struct {
		Error string `json:"error"`
	}
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if response.Error == "" {
		t.Fatal("expected error message, got empty string")
	}
}

func setupTest() func() {
	log.Println("setting up test...")
	cfg := setupConfigTest()
	server := initialiseServer(cfg, http.NewServeMux())
	go server.ListenAndServe()
	return func() {
		log.Println("tearing down test...")
		server.Close()
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
	emptyDB(db)
	auth.TEST = true
	return apiConfig{
		port:       "8080",
		DB:         database.New(db),
		JWT_Secret: []byte(os.Getenv("JWT_SECRET")),
	}
}

func emptyDB(db *sql.DB) {
	var tables = []string{
		"users",
	}
	for _, table := range tables {
		_, err := db.Exec(fmt.Sprintf("DELETE FROM %s;", table))
		if err != nil {
			log.Panicf("failed to truncate table %s", err)
		}
	}
}

func loopSendRequest(requestURL, method string, body io.Reader, headers map[string]string, t *testing.T) *http.Response {
	res := &http.Response{}
	var err error
	for i := 0; i < 5; i++ {
		fmt.Printf("%s %s : Attempt %d\n", method, requestURL, i+1)
		err = nil
		req, err := http.NewRequest(method, requestURL, body)
		if err != nil {
			t.Fatalf("client: could not create request: %s\n", err)
		}
		for key, value := range headers {
			req.Header.Set(key, value)
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
	return res
}

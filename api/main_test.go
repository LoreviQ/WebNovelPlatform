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
	t.Run("TEST: USERS", func(t *testing.T) {
		uid := testPostUser(t)
		testGetUser(t, uid)
	})
	t.Run("TEST: AUTH", func(t *testing.T) {
		log.Print("Login")
		accessToken, refreshToken := testPostLogin(t)
		testPutUser(t, accessToken)
		log.Print("Waiting for token to expire...")
		time.Sleep(time.Second * 16)
		testPutUserFail(t, accessToken)
		log.Print("Refreshing token...")
		updatedToken := testRefresh(t, refreshToken)
		testPutUser(t, updatedToken)
		log.Print("Revoking token...")
		testRevokeRefresh(t, refreshToken)
		testRefreshFail(t, refreshToken)
	})

	t.Run("TEST: FICTIONS", func(t *testing.T) {
		accessToken, _ := testPostLogin(t)
		testPostFiction(t, accessToken)
		testGetFiction(t, accessToken)
		testGetFictions(t)
		testPutFiction(t, accessToken)
		testDeleteFiction(t, accessToken)
		testGetFictionFail(t)
		testPostFiction(t, accessToken)
		testDeleteFictionFail(t)
	})

	t.Run("TEST: CHAPTERS", func(t *testing.T) {
		accessToken := setupChapterTests(t)
		id1, id2 := testPostChapter(t, accessToken)
		testGetChapter(t, id1)
		testGetUnpublishedChapter(t, id2, accessToken)
		testGetChapters(t, accessToken)
		testPutChapter(t, id2, accessToken)
		testDeleteChapter(t, id2, accessToken)
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

func testPostUser(t *testing.T) uuid.UUID {
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
	if res.StatusCode != http.StatusCreated {
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
	return response.ID
}

func testGetUser(t *testing.T, uid uuid.UUID) {
	// Test the GET /v1/users/{id} endpoint
	// Create a new request to the /v1/users/{id} endpoint
	// Send the request
	// Check the response status code is 200
	// Check the response body matches the created user

	// Create a new request to the GET /v1/users/{id} endpoint
	requestURL := fmt.Sprintf("http://localhost:8080/v1/users/%s", uid)
	res := loopSendRequest(requestURL, http.MethodGet, nil, nil, t)

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

func testPostLogin(t *testing.T) (string, string) {
	// Test the POST /v1/login endpoint
	// Create a new request to the /v1/login endpoint
	// Send the request
	// Check the response status code is 200
	// Check the response body matches the loged in user and an access token is returned

	// Create a new request to the POST /v1/login endpoint
	body := []byte(`{
		"email": "test@test.com",
		"password": "password",
		"remember_me": true
		}`)
	requestURL := "http://localhost:8080/v1/login"
	res := loopSendRequest(requestURL, http.MethodPost, bytes.NewBuffer(body), nil, t)

	// Compare Response
	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected status code 200, got %d", res.StatusCode)
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
	if response.AuthData.AccessToken.Token == "" {
		t.Fatalf("expected access token, got %q", response.AuthData.AccessToken)
	}
	return response.AuthData.AccessToken.Token, response.AuthData.RefreshToken.Token
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
		logErrorResponse(res)
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

func testRefresh(t *testing.T, refreshToken string) string {
	// Test the POST /v1/refresh endpoint
	// Create a new request to the /v1/refresh endpoint
	// Send the request
	// Check the response status code is 200
	// Check the response body matches the refreshed access token

	// Create a new request to the POST /v1/refresh endpoint
	requestURL := "http://localhost:8080/v1/refresh"
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", refreshToken),
	}
	res := loopSendRequest(requestURL, http.MethodPost, nil, headers, t)

	// Compare Response
	if res.StatusCode != http.StatusOK {
		logErrorResponse(res)
		t.Fatalf("expected status code 200, got %d", res.StatusCode)
	}
	var response struct {
		AccessToken string `json:"token"`
	}
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatalf("could not read response body: %v", err)
	}
	if response.AccessToken == "" {
		t.Fatalf("expected access token, got %q", response.AccessToken)
	}
	return response.AccessToken
}

func testRevokeRefresh(t *testing.T, refreshToken string) {
	// Test the POST /v1/revoke endpoint
	// Create a new request to the /v1/revoke endpoint
	// Send the request
	// Check the response status code is 200

	// Create a new request to the POST /v1/revoke endpoint
	requestURL := "http://localhost:8080/v1/revoke"
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", refreshToken),
	}
	res := loopSendRequest(requestURL, http.MethodPost, nil, headers, t)

	// Compare Response
	if res.StatusCode != http.StatusOK {
		logErrorResponse(res)
		t.Fatalf("expected status code 200, got %d", res.StatusCode)
	}
}

func testRefreshFail(t *testing.T, refreshToken string) {
	// Test the POST /v1/refresh endpoint
	// Same as above but expecting it to fail since the refresh token has already been revoked

	// Create a new request to the POST /v1/revoke endpoint
	requestURL := "http://localhost:8080/v1/refresh"
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", refreshToken),
	}
	res := loopSendRequest(requestURL, http.MethodPost, nil, headers, t)

	// Compare Response
	if res.StatusCode != http.StatusUnauthorized {
		logErrorResponse(res)
		t.Fatalf("expected status code 401, got %d", res.StatusCode)
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
		"tokens",
		"chapters",
		"fictions",
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

func logErrorResponse(res *http.Response) {
	var response struct {
		Error string `json:"error"`
	}
	err := json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		log.Printf("could not read response body: %v", err)
	}
	log.Printf("Error: %s", response.Error)
}

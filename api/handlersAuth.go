package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"cloud.google.com/go/storage"

	"github.com/LoreviQ/WebNovelPlatform/api/internal/auth"
	"github.com/LoreviQ/WebNovelPlatform/api/internal/database"
)

func (cfg *apiConfig) getLogin(w http.ResponseWriter, r *http.Request, user database.User) {
	// RESPONSE
	type responseStruct struct {
		ID    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}
	respondWithJSON(w, 200, responseStruct{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	})
}

func (cfg *apiConfig) postLogin(w http.ResponseWriter, r *http.Request) {
	// REQUEST
	request, err := decodeRequest(w, r, struct {
		Email      string `json:"email"`
		Password   string `json:"password"`
		RememberMe bool   `json:"remember_me"`
	}{})
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "failed to decode request body")
		return
	}

	// AUTHENTICATE USER
	user, err := auth.AuthenticateUser(request.Email, []byte(request.Password), cfg.DB)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	// CREATE JWT TOKENS
	accessToken, accessExpires, err := auth.IssueAccessToken(user.ID, cfg.JWT_Secret)
	if err != nil {
		log.Printf("Error Creating Access Token: %s", err)
		w.WriteHeader(500)
		return
	}
	refreshToken, refreshExpires := "", time.Time{}
	if request.RememberMe {
		refreshToken, refreshExpires, err = auth.IssueRefreshToken(user.ID, cfg.DB, r.Context())
		if err != nil {
			log.Printf("Error Creating Refresh Token: %s", err)
			w.WriteHeader(500)
			return
		}
	}

	// RESPONSE
	type userData struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	}
	type accessTokenStruct struct {
		Token   string    `json:"token"`
		Expires time.Time `json:"expires"`
	}
	type refreshTokenStruct struct {
		Token   string    `json:"token"`
		Expires time.Time `json:"expires"`
	}
	type authData struct {
		AccessToken  accessTokenStruct  `json:"access"`
		RefreshToken refreshTokenStruct `json:"refresh"`
	}
	type responseStruct struct {
		UserData userData `json:"user"`
		AuthData authData `json:"auth"`
	}
	rtResponse := refreshTokenStruct{}
	if request.RememberMe {
		rtResponse = refreshTokenStruct{
			Token:   refreshToken,
			Expires: refreshExpires,
		}
	}
	respondWithJSON(w, 200, responseStruct{
		UserData: userData{
			ID:   user.ID,
			Name: user.Name,
		},
		AuthData: authData{
			AccessToken: accessTokenStruct{
				Token:   accessToken,
				Expires: accessExpires,
			},
			RefreshToken: rtResponse,
		},
	})
}

func (cfg *apiConfig) getRefresh(w http.ResponseWriter, r *http.Request) {
	// GET REFRESH TOKEN FROM HEADER
	header := r.Header.Get("Authorization")
	if header == "" {
		respondWithError(w, http.StatusUnauthorized, "No Authorization Header")
		return
	}
	refreshToken := header[len("Bearer "):]

	// Checks if the refresh token is valid
	_, err := auth.AuthenticateRefreshToken(refreshToken, cfg.DB, r.Context())
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (cfg *apiConfig) postRefresh(w http.ResponseWriter, r *http.Request) {
	// GET REFRESH TOKEN FROM HEADER
	header := r.Header.Get("Authorization")
	if header == "" {
		respondWithError(w, http.StatusUnauthorized, "No Authorization Header")
		return
	}
	refreshToken := header[len("Bearer "):]

	// REFRESH ACCESS TOKEN
	accessToken, expires, err := auth.RefreshAccessToken(refreshToken, cfg.DB, r.Context(), cfg.JWT_Secret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, err.Error())
		return
	}

	// RESPONSE
	type responseStruct struct {
		Token   string    `json:"token"`
		Expires time.Time `json:"expires"`
	}
	respondWithJSON(w, 200, responseStruct{
		Token:   accessToken,
		Expires: expires,
	})
}

func (cfg *apiConfig) postRevoke(w http.ResponseWriter, r *http.Request) {
	// GET REFRESH TOKEN FROM HEADER
	header := r.Header.Get("Authorization")
	if header == "" {
		respondWithError(w, http.StatusUnauthorized, "No Authorization Header")
		return
	}
	refreshToken := header[len("Bearer "):]

	// REVOKE REFRESH TOKEN
	err := auth.RevokeRefreshToken(refreshToken, cfg.DB, r.Context())
	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	w.WriteHeader(200)
}

// getSignedURL returns a signed URL for the client to upload a file to GCS
func (cfg *apiConfig) getSignedURL(w http.ResponseWriter, r *http.Request, user database.User) {
	// REQUEST
	request, err := decodeRequest(w, r, struct {
		Filename string `json:"filename"`
		Filetype string `json:"filetype"`
	}{})
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "failed to decode request body")
		return
	}

	// Initializes a GCS client
	client, err := storage.NewClient(context.Background())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "storage.NewClient: "+err.Error())
		return
	}
	defer client.Close()

	bucketName := "webnovelapp-images"
	objectName := "uploads/" + user.ID + "/" + request.Filename
	urlExpiration := time.Now().Add(15 * time.Minute)

	signedURL, err := client.Bucket(bucketName).SignedURL(objectName, &storage.SignedURLOptions{
		Method:      "PUT",
		Expires:     urlExpiration,
		ContentType: request.Filetype,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to generate signed URL: "+err.Error())
		return
	}

	// RESPONSE
	type responseStruct struct {
		URL     string    `json:"url"`
		Expires time.Time `json:"expires"`
	}
	respondWithJSON(w, 200, responseStruct{
		URL:     signedURL,
		Expires: urlExpiration,
	})
}

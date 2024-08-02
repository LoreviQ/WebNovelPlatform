// Utility functions for making API calls

import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.API_URL || "https://webnovelapi-y5hewbdc4a-nw.a.run.app",
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the auth token from local storage or any other storage mechanism
        const access = JSON.parse(localStorage.getItem("access"));

        // If the token exists, add it to the headers
        if (access) {
            config.headers["Authorization"] = `Bearer ${access.token}`;
        }

        return config;
    },
    (error) => {
        // Handle the error
        return Promise.reject(error);
    }
);

const apiEndpoints = {
    user: (userID) => `/v1/users/${userID}`,
    userProfile: "/v1/users/profile",
    fiction: (fictionID) => `/v1/fictions/${fictionID}`,
    fictions: (query = "") => `/v1/fictions${query}`, // (Search query, optional)
    userFictions: (userID) => `/v1/users/${userID}/fictions`, // (userID || 'me', mandatory)
    publishFiction: (fictionID) => `/v1/fictions/${fictionID}/publish`,
    gcsSignedUrl: "/v1/gcs-signed-url",
    chapters: (fictionID) => `/v1/fictions/${fictionID}/chapters`,
    chapter: (fictionID, chapterID) => `/v1/fictions/${fictionID}/chapters/${chapterID}`,
};

// exported function that uses axiosInstance to make authenticated requests
async function axiosAuthed(method, url, body = null) {
    try {
        let response;
        switch (method.toUpperCase()) {
            case "GET":
                response = await axiosInstance.get(url);
                break;
            case "POST":
                response = await axiosInstance.post(url, body);
                break;
            case "PUT":
                response = await axiosInstance.put(url, body);
                break;
            case "DELETE":
                response = await axiosInstance.delete(url);
            default:
                throw new Error(`Unsupported method: ${method}`);
        }
        return { data: response.data, error: null };
    } catch (error) {
        if (error.response) {
            return { data: null, error: error.response.status };
        } else {
            console.error(`Error with ${method} request:`, error);
            return { data: null, error: "Unknown error" };
        }
    }
}

// Uploads a file to GCS
async function uploadFileToGCS(file) {
    const { data, error } = await axiosAuthed("POST", apiEndpoints.gcsSignedUrl, {
        filename: file.name,
        filetype: file.type,
    });
    if (error) {
        return false;
    }
    const signedUrl = data.url;
    const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type,
        },
    });
    if (uploadResponse.ok) {
        return signedUrl.split("?")[0];
    }
    return false;
}

export { apiEndpoints, axiosAuthed, uploadFileToGCS };

// Utility functions for making API calls

import axiosInstance from "./axiosInstance";
const apiBaseUrl = process.env.API_URL || "https://webnovelapi-y5hewbdc4a-nw.a.run.app";
//const apiBaseUrl = "http://localhost:8080";

const apiEndpoints = {
    user: (userID) => `/v1/users/${userID}`, // (userID, mandatory)
    userProfile: "/v1/users/profile",
    fiction: (fictionID) => `/v1/fictions/${fictionID}`, // (fictionID, mandatory)
    fictions: (query) => `/v1/fictions${query ? query : ""}`, // (Search query, optional)
    userFictions: (userID) => `/v1/users/${userID}/fictions`, // (userID || 'me', mandatory)
    publishFiction: (fictionID) => `/v1/fictions/${fictionID}/publish`, // (fictionID, mandatory)
    gcsSignedUrl: "/v1/gcs-signed-url",
};

// axios function that includes the access token in the request
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

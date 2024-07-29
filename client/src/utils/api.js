// Utility functions for making API calls

import axiosInstance from "./axiosInstance";
const apiBaseUrl = process.env.API_URL || "https://webnovelapi-y5hewbdc4a-nw.a.run.app";
//const apiBaseUrl = "http://localhost:8080";

const apiEndpoints = {
    fiction: "/v1/fictions/", // + fictionID
    myFictions: "/v1/users/me/fictions",
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

// Gets a user by their UID
async function getUserByUID(uid) {
    const response = await fetch(apiBaseUrl + "/v1/users/" + uid, {
        method: "GET",
    });
    if (response.status === 200) {
        let body = await response.json();
        return body;
    }
    return false;
}

// Gets all fictions
async function getFictions(search) {
    const query = search ? `${search}` : "";
    const url = `${apiBaseUrl}/v1/fictions${query}`;

    // Fetch fictions
    const response = await fetch(url, {
        method: "GET",
    });
    if (response.status === 200) {
        let body = await response.json();
        return body;
    }
    return false;
}

// Gets fictions by the author's UID
async function getFictionsByAuthorID(uid) {
    const response = await fetch(apiBaseUrl + "/v1/users/" + uid + "/fictions", {
        method: "GET",
    });
    if (response.status === 200) {
        let body = await response.json();
        return body;
    }
    return false;
}

//Submits a fiction to the logged in user's account
async function postFiction(accessToken, args) {
    const [fictionData, imageLocation] = args;
    const response = await fetch(apiBaseUrl + "/v1/fictions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({
            title: fictionData.title,
            description: fictionData.description,
            imageLocation: imageLocation,
        }),
    });
    if (response.status === 201) {
        return true;
    }
    return false;
}

// Publishes the fiction with the given ID
async function publishFiction(accessToken, fictionID) {
    const response = await fetch(apiBaseUrl + "/v1/fictions/" + fictionID + "/publish", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
    });
    if (response.status === 200) {
        return true;
    }
    return false;
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

// Updates a users profile
async function putUser(accessToken, args) {
    const [userData, imageUrl] = args;
    const response = await fetch(apiBaseUrl + "/v1/users/profile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({
            email: userData.email,
            image_url: imageUrl,
        }),
    });
    if (response.status === 200) {
        return true;
    }
    return false;
}

export {
    apiEndpoints,
    axiosAuthed,
    getUserByUID,
    putUser,
    getFictions,
    getFictionsByAuthorID,
    postFiction,
    publishFiction,
    uploadFileToGCS,
};

// Utility functions for making API calls

const apiBaseUrl = process.env.API_URL || "https://webnovelapi-y5hewbdc4a-nw.a.run.app";
//const apiBaseUrl = "http://localhost:8080";

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
async function getFictions() {
    const response = await fetch(apiBaseUrl + "/v1/fictions", {
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

async function getMyFictions(accessToken) {
    const response = await fetch(apiBaseUrl + "/v1/users/me/fictions", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
    });
    if (response.status === 200) {
        let body = await response.json();
        return body;
    }
    return false;
}

// Gets fictions details from fiction ID
async function getFictionByID(fictionID) {
    const response = await fetch(apiBaseUrl + "/v1/fictions/" + fictionID, {
        method: "GET",
    });
    if (response.status === 200) {
        let body = await response.json();
        return body;
    }
    return false;
}

//Submits a fiction to the logged in user's account
async function postFiction(accessToken, fictionData) {
    const response = await fetch(apiBaseUrl + "/v1/fictions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({ title: fictionData.title, description: fictionData.description }),
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

// Deletes the fiction with the given ID
async function deleteFiction(accessToken, fictionID) {
    const response = await fetch(apiBaseUrl + "/v1/fictions/" + fictionID, {
        method: "DELETE",
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

// Updates the fiction with the given ID
async function putFiction(accessToken, args) {
    const [fictionData, fictionid] = args;
    const response = await fetch(apiBaseUrl + "/v1/fictions/" + fictionid, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({
            new_id: fictionData.id,
            title: fictionData.title,
            description: fictionData.description,
            published: fictionData.published ? 1 : 0,
        }),
    });
    if (response.status === 200) {
        return true;
    }
    return false;
}

// get signed url for GCS
async function getSignedUrl(accessToken) {
    const response = await fetch(apiBaseUrl + "/v1/gcs-signed-url", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
    });
    if (response.status === 200) {
        let body = await response.json();
        return body;
    }
    return false;
}

// Uploads a file to GCS
async function uploadFileToGCS(accessToken, args) {
    const [file] = args;
    const response = await fetch(apiBaseUrl + "/v1/gcs-signed-url", {
        method: "GET",
        body: JSON.stringify({ filename: file.name, filetype: file.type }),
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
    });
    if (response.status != 200) {
        return false;
    }
    let body = await response.json();
    const signedUrl = body.url;
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

export {
    getUserByUID,
    getFictionByID,
    getFictions,
    getFictionsByAuthorID,
    getMyFictions,
    postFiction,
    publishFiction,
    deleteFiction,
    putFiction,
    uploadFileToGCS,
};

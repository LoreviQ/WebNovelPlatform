// Utility functions for making API calls

const apiBaseUrl = process.env.API_URL || "https://webnovelapi-y5hewbdc4a-nw.a.run.app";

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

export { getUserByUID, getFictionsByAuthorID, postFiction };

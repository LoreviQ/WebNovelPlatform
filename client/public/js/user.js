// Returns json of user by uid
async function getUserByUID(uid) {
    const response = await fetch(apiBaseUrl + "/v1/users/" + uid, {
        method: "GET",
    });
    if (response.status === 200) {
        body = await response.json();
        return body;
    }
    return null;
}

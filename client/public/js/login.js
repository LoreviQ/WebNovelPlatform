/*
Code for the login page at baseurl/login
*/

window.addEventListener("DOMContentLoaded", function () {
    const apiBaseUrl = "https://webnovelapi-y5hewbdc4a-nw.a.run.app"; // Change this to your actual API base URL
    // Handle form submission for logging in
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission
        console.log("Attempting login...");

        // Gather form data
        const email = document.getElementById("inputEmail").value;
        const password = document.getElementById("inputPassword").value;

        const postData = {
            email: email,
            password: password,
        };

        // Make AJAX POST request
        fetch(apiBaseUrl + "/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        })
            .then((response) => {
                // Check if the response status is 200 (OK)
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(
                        "Status:" +
                            response.status +
                            "\nFailed to login: " +
                            response.statusText
                    );
                }
            })
            .then((data) => {
                console.log("Response data:", data);
                alert("Logged in successfully!");
                loginForm.reset();
            })
            .catch((error) => {
                console.error("Error logging in:", error);
                alert("Invalid Username or Password.");
            });
    });
});

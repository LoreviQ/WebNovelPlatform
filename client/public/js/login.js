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

        const currentDomain = `${window.location.protocol}//${window.location.host}`;
        fetch(currentDomain + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        })
            .then((response) => {
                if (response.ok) {
                    // Check if response status is 200
                    window.location.href = "/";
                } else {
                    throw new Error(
                        "Status:" +
                            response.status +
                            "\nFailed to login: " +
                            response.statusText
                    );
                }
            })
            .catch((error) => {
                console.error("Error logging in:", error);
                alert("Invalid Username or Password.");
            });
    });
});

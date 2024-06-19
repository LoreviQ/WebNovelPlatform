/*
Code for the login page at baseurl/register
*/

window.addEventListener("DOMContentLoaded", (event) => {
    const apiBaseUrl = "https://webnovelapi-y5hewbdc4a-nw.a.run.app"; // Change this to your actual API base URL

    // Handle form submission for creating an account
    const registrationForm = document.getElementById("create-account-form");
    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Gather form data
        const username = document.getElementById("inputUsername").value;
        const email = document.getElementById("inputEmail").value;
        const password = document.getElementById("inputPassword").value;
        const passwordConfirm = document.getElementById(
            "inputPasswordConfirm"
        ).value;

        // Perform client-side validation if needed
        if (password !== passwordConfirm) {
            alert("Passwords do not match.");
            return;
        }

        const postData = {
            name: username,
            email: email,
            password: password,
        };
        // Make AJAX POST request
        fetch(apiBaseUrl + "/v1/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        })
            .then((response) => {
                // Check if the response status is 201 (Created)
                if (response.status === 201) {
                    return response.json();
                } else {
                    throw new Error(
                        "Failed to create account: " + response.statusText
                    );
                }
            })
            .then((data) => {
                console.log("Response data:", data);
                alert("Account created successfully!");
                registrationForm.reset();
            })
            .catch((error) => {
                console.error("Error creating account:", error);
                alert("Failed to create account. Please try again.");
            });
    });
});

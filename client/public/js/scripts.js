/*!
 * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector("#sidebarToggle");
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener("click", (event) => {
            event.preventDefault();
            document.body.classList.toggle("sb-sidenav-toggled");
            localStorage.setItem(
                "sb|sidebar-toggle",
                document.body.classList.contains("sb-sidenav-toggled")
            );
        });
    }

    // Handle form submission for creating an account
    const form = document.getElementById("create-account-form");
    form.addEventListener("submit", function (event) {
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
        console.log("sending request to localhost:8080/v1/users");
        // Make AJAX POST request
        fetch("http://localhost:8080/v1/users", {
            // Replace with your actual API endpoint
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        })
            .then((response) => {
                console.log("Response received:", response);
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    alert("Account created successfully!");
                } else {
                    alert(
                        "Failed to create account. " +
                            (data.message || "Please try again.")
                    );
                }
            })
            .catch((error) => {
                console.error("Error creating account:", error);
                alert("Failed to create account. Please try again.");
            });
    });
});

/*!
 * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */
//
// Scripts
//
const apiBaseUrl = "https://webnovelapi-y5hewbdc4a-nw.a.run.app"; // Change this to your actual API base URL

window.addEventListener("DOMContentLoaded", async (event) => {
    const loggedIn = await isAuthenticated();

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

    //update navbar based on authentication status
    if (loggedIn) {
        document.getElementById("logoutLink").style.display = "block";
        document.getElementById("registerLink").style.display = "none";
        document.getElementById("loginLink").style.display = "none";
    } else {
        document.getElementById("logoutLink").style.display = "none";
        document.getElementById("registerLink").style.display = "block";
        document.getElementById("loginLink").style.display = "block";
    }
});

async function isAuthenticated() {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken && refreshToken) {
        const response = await fetch(apiBaseUrl + "/v1/refresh", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + refreshToken,
            },
        });
        if (response.status === 200) {
            return true;
        }
    }
    return false;
}

async function logout() {
    const refreshToken = localStorage.getItem("refreshToken");
    fetch(apiBaseUrl + "/v1/revoke", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + refreshToken,
        },
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload();
}

/*!
 * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */
//
// Scripts
//
const apiBaseUrl = "https://webnovelapi-y5hewbdc4a-nw.a.run.app"; // Change this to your actual API base URL

if (localStorage.getItem("sb|sidebar-toggle") === "true") {
    document.body.classList.toggle("sb-sidenav-toggled");
}

window.addEventListener("DOMContentLoaded", async (event) => {
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector("#sidebarToggle");
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", (event) => {
            event.preventDefault();
            document.body.classList.toggle("sb-sidenav-toggled");
            localStorage.setItem(
                "sb|sidebar-toggle",
                document.body.classList.contains("sb-sidenav-toggled")
            );
        });
    }

    //update elements based on authentication status
    const loggedIn = await isAuthenticated();
    if (loggedIn) {
        var user = await getUser();
        document.getElementById("userStatus").textContent = user.name;
        document.getElementById("profileLink").href = "/user/" + user.id;
        document.getElementById("fictionsLink").href =
            "/user/" + user.id + "/fictions";
    } else {
        document.getElementById("navbarDropdown").style.display = "none";
        document.getElementById("loginButton").style.display = "block";
    }

    // Set the theme
    const theme = localStorage.getItem("theme");
    if (!theme || theme === "dark") {
        setDarkTheme(); //default theme
    } else {
        setLightTheme();
    }
});

async function getUser() {
    var accessToken = localStorage.getItem("accessToken");
    var user = await getLoggedInUser(accessToken);
    if (!user.id) {
        accessToken = await refreshToken();
        user = await getLoggedInUser(accessToken);
    }
    return user;
}

async function isAuthenticated(checkValid = false) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
        if (!checkValid) {
            return true;
        }
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

async function refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
        const response = await fetch(apiBaseUrl + "/v1/refresh", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + refreshToken,
            },
        });
        if (response.status === 200) {
            body = await response.json();
            return body.token;
        }
    }
    return false;
}

// Returns json of logged in user
async function getLoggedInUser(accessToken) {
    if (accessToken) {
        const response = await fetch(apiBaseUrl + "/v1/login", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        });
        if (response.status === 200) {
            body = await response.json();
            return body;
        }
    }
    return null;
}

function toggleTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
        setDarkTheme();
    } else {
        setLightTheme();
    }
}

function setDarkTheme() {
    localStorage.setItem("theme", "dark");

    const themeIcon = document.getElementById("themeIcon");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");

    const sidenav = document.getElementById("sidenavAccordion");
    sidenav.classList.remove("sb-sidenav-dark");
    sidenav.classList.add("sb-sidenav-light");

    const mainBody = document.getElementById("layoutSidenav_content");
    mainBody.classList.remove("sb-sidenav-dark");
    mainBody.classList.add("sb-sidenav-light");
}

function setLightTheme() {
    localStorage.setItem("theme", "light");

    const themeIcon = document.getElementById("themeIcon");
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");

    const sidenav = document.getElementById("sidenavAccordion");
    sidenav.classList.remove("sb-sidenav-light");
    sidenav.classList.add("sb-sidenav-dark");

    const mainBody = document.getElementById("layoutSidenav_content");
    mainBody.classList.remove("sb-sidenav-light");
    mainBody.classList.add("sb-sidenav-dark");
}

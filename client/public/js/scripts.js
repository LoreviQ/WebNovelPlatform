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

    // Set the theme
    const theme = localStorage.getItem("theme");
    if (!theme || theme === "dark") {
        setDarkTheme(); //default theme
    } else {
        setLightTheme();
    }
});

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

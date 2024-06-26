const initTheme = () => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    applyTheme(savedTheme);
};

const toggleTheme = () => {
    const theme = localStorage.getItem("theme") || "dark";
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    return newTheme;
};

const applyTheme = (theme) => {
    const sidenav = document.getElementById("sidenavAccordion");
    const mainBody = document.getElementById("layoutSidenav_content");
    if (theme === "dark") {
        sidenav.classList.replace("sb-sidenav-light", "sb-sidenav-dark");
        mainBody.classList.replace("sb-sidenav-light", "sb-sidenav-dark");
    } else {
        sidenav.classList.replace("sb-sidenav-dark", "sb-sidenav-light");
        mainBody.classList.replace("sb-sidenav-dark", "sb-sidenav-light");
    }
};

export { initTheme, toggleTheme, applyTheme };

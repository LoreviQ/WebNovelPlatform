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
    const themeClass = theme === "dark" ? "sb-sidenav-dark" : "sb-sidenav-light";
    const oppositeThemeClass = theme === "dark" ? "sb-sidenav-light" : "sb-sidenav-dark";
    document.querySelectorAll(`.${oppositeThemeClass}`).forEach((el) => {
        el.classList.replace(oppositeThemeClass, themeClass);
    });
    document.documentElement.setAttribute("data-bs-theme", theme);
};

export { initTheme, toggleTheme, applyTheme };

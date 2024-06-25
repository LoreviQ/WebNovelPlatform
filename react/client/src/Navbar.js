import React from "react";

function Navbar({ userData, toggleTheme, logout }) {
    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            {/* Navbar Brand*/}
            <a className="navbar-brand ps-3" href="/index">
                WebNovelPlatform
            </a>
            {/* Sidebar Toggle*/}
            <button
                className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
                id="sidebarToggle"
                href="#!"
            >
                <i className="fas fa-bars"></i>
            </button>
            {/* Navbar Search*/}
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div className="input-group">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Search for..."
                        aria-label="Search for..."
                        aria-describedby="btnNavbarSearch"
                    />
                    <button
                        className="btn btn-primary"
                        id="btnNavbarSearch"
                        type="button"
                    >
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </form>
            {/* Dark Mode Toggle Button */}
            <ul className="navbar-nav ms-auto ms-md-0">
                <li className="nav-item">
                    <a className="nav-link" role="button" onClick={toggleTheme}>
                        <i className="fas fa-moon fa-fw" id="themeIcon"></i>
                    </a>
                </li>
            </ul>
            {/* Navbar*/}
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                {userData ? (
                    <li id="navbarDropdown" className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fas fa-user fa-fw"></i>
                        </a>
                        <ul
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="navbarDropdown"
                        >
                            <li>
                                <a
                                    id="profileLink"
                                    className="dropdown-item"
                                    href="/user/me"
                                >
                                    My Profile
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <a className="dropdown-item" href="#!">
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" onClick={logout}>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </li>
                ) : (
                    <a
                        id="loginButton"
                        className="btn btn-primary"
                        href="/login"
                    >
                        Log In
                    </a>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;

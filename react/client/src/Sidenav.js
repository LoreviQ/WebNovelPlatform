import React, { useState } from "react";
// If using react-icons, import necessary icons
// For example, if using FontAwesome icons:
// import { FaTachometerAlt, FaBook, FaColumns, FaBookOpen, FaAngleDown } from 'react-icons/fa';

const SideNav = () => {
    return (
        <div id="layoutSidenav_nav">
            <nav
                className="sb-sidenav accordion sb-sidenav-dark"
                id="sidenavAccordion"
            >
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading">Core</div>
                        <a className="nav-link" href="/">
                            <div className="sb-nav-link-icon">
                                <i className="fas fa-tachometer-alt"></i>
                            </div>
                            Home
                        </a>
                        <a
                            id="fictionsLink"
                            className="nav-link"
                            href="/user/me/fictions"
                        >
                            <div className="sb-nav-link-icon">
                                <i className="fa-solid fa-book"></i>
                            </div>
                            Fictions
                        </a>
                        <div className="sb-sidenav-menu-heading">Demo</div>
                        <a className="nav-link" href="/example">
                            <div className="sb-nav-link-icon">
                                <i className="fas fa-tachometer-alt"></i>
                            </div>
                            Dashboard
                        </a>
                        <a
                            className="nav-link collapsed"
                            href="#"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseLayouts"
                            aria-expanded="false"
                            aria-controls="collapseLayouts"
                        >
                            <div className="sb-nav-link-icon">
                                <i className="fas fa-columns"></i>
                            </div>
                            Layouts
                            <div className="sb-sidenav-collapse-arrow">
                                <i className="fas fa-angle-down"></i>
                            </div>
                        </a>
                        {/* Collapse components and other links would go here */}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default SideNav;

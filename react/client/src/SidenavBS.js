import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Collapse from "react-bootstrap/Collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MySideNav() {
    const [openSegments, setOpenSegments] = useState({
        layouts: false,
        pages: false,
        authentication: false,
        error: false,
    });
    const toggleSegment = (segment) => {
        setOpenSegments((prev) => ({ ...prev, [segment]: !prev[segment] }));
    };
    return (
        <div id="layoutSidenav_nav">
            <Nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <Nav>
                        <div className="sb-sidenav-menu-heading">Core</div>
                        <a className="nav-link" href="/">
                            <FontAwesomeIcon className="sb-nav-link-icon" icon="fa-tachometer-alt" />
                            Home
                        </a>
                        <a id="fictionsLink" className="nav-link" href="/user/me/fictions">
                            <FontAwesomeIcon className="sb-nav-link-icon" icon="fa-book" />
                            Fictions
                        </a>
                        <div className="sb-sidenav-menu-heading">Demo</div>
                        <a className="nav-link" href="/example">
                            <FontAwesomeIcon className="sb-nav-link-icon" icon="fa-tachometer-alt" />
                            Dashboard
                        </a>
                        <a
                            className={`nav-link ${!openSegments.layouts ? "collapsed" : ""}`}
                            onClick={() => toggleSegment("layouts")}
                            aria-expanded={openSegments.layouts}
                            aria-controls="collapseLayouts"
                        >
                            <FontAwesomeIcon className="sb-nav-link-icon" icon="fa-columns" />
                            Layouts
                            <FontAwesomeIcon className="sb-sidenav-collapse-arrow" icon="fa-angle-down" />
                        </a>
                        <Collapse
                            in={openSegments.layouts}
                            id="collapseLayouts"
                            aria-labelledby="headingOne"
                            data-bs-parent="#sidenavAccordion"
                        >
                            <nav className="sb-sidenav-menu-nested nav">
                                <a className="nav-link" href="/layout-static">
                                    Static Navigation
                                </a>
                                <a className="nav-link" href="/layout-sidenav-light">
                                    Light Sidenav
                                </a>
                            </nav>
                        </Collapse>
                        <a
                            className={`nav-link ${!openSegments.pages ? "collapsed" : ""}`}
                            onClick={() => toggleSegment("pages")}
                            aria-expanded={openSegments.pages}
                            aria-controls="collapsePages"
                        >
                            <FontAwesomeIcon className="sb-nav-link-icon" icon="fa-book-open" />
                            Pages
                            <FontAwesomeIcon className="sb-sidenav-collapse-arrow" icon="fa-angle-down" />
                        </a>
                        <Collapse
                            in={openSegments.pages}
                            id="collapsePages"
                            aria-labelledby="headingTwo"
                            data-bs-parent="#sidenavAccordion"
                        >
                            <nav className="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                                <a
                                    className={`nav-link ${!openSegments.authentication ? "collapsed" : ""}`}
                                    onClick={() => toggleSegment("authentication")}
                                    aria-expanded={openSegments.authentication}
                                    aria-controls="pagesCollapseAuth"
                                >
                                    Authentication
                                    <FontAwesomeIcon className="sb-sidenav-collapse-arrow" icon="fa-angle-down" />
                                </a>
                                <Collapse
                                    in={openSegments.authentication}
                                    id="pagesCollapseAuth"
                                    aria-labelledby="headingOne"
                                    data-bs-parent="#sidenavAccordionPages"
                                >
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <a className="nav-link" href="/login">
                                            Login
                                        </a>
                                        <a className="nav-link" href="/register">
                                            Register
                                        </a>
                                        <a className="nav-link" href="/password">
                                            Forgot Password
                                        </a>
                                    </nav>
                                </Collapse>
                                <a
                                    className={`nav-link ${!openSegments.error ? "collapsed" : ""}`}
                                    onClick={() => toggleSegment("error")}
                                    aria-expanded={openSegments.error}
                                    aria-controls="pagesCollapseError"
                                >
                                    Error
                                    <FontAwesomeIcon className="sb-sidenav-collapse-arrow" icon="fa-angle-down" />
                                </a>
                                <Collapse
                                    in={openSegments.error}
                                    id="pagesCollapseError"
                                    aria-labelledby="headingOne"
                                    data-bs-parent="#sidenavAccordionPages"
                                >
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <a className="nav-link" href="/401">
                                            401 Page
                                        </a>
                                        <a className="nav-link" href="/404">
                                            404 Page
                                        </a>
                                        <a className="nav-link" href="/500">
                                            500 Page
                                        </a>
                                    </nav>
                                </Collapse>
                            </nav>
                        </Collapse>
                    </Nav>
                </div>
                <div className="sb-sidenav-footer">
                    <div className="small" id="loginStatusText">
                        Logged in as:
                    </div>
                    <div id="userStatus">Not logged in</div>
                </div>
            </Nav>
        </div>
    );
}

export default MySideNav;

import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMoon, faSun, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { toggleTheme } from "../utils/theme";
import { useAuth } from "../utils/auth";

function MyNavbar({ toggleSideNav }) {
    const { user, gettingUser, logout } = useAuth();
    const [theme, setTheme] = useState("dark");

    const toggleSidebar = () => {
        const isToggled = document.body.classList.toggle("sb-sidenav-toggled");
        localStorage.setItem("sb|sidebar-toggle", isToggled);
        toggleSideNav;
    };
    const localToggleTheme = () => {
        var newTheme = toggleTheme();
        setTheme(newTheme);
    };

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            aria-expanded="false"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
            {gettingUser ? "..." : user ? user.name : "Not logged in"}
            {!gettingUser && user.image_url ? (
                <img
                    src={user.image_url}
                    alt="User"
                    className="ms-2 rounded-circle"
                    style={{ width: "2rem", height: "2rem" }}
                />
            ) : (
                <FontAwesomeIcon className="ms-3" icon={faUser} />
            )}
        </a>
    ));

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <Container fluid="xl">
                <Navbar.Brand className="ps-3" href="/">
                    WebNovelPlatform
                </Navbar.Brand>
                <Button variant="link" size="sm" className="me-4 me-lg-0" id="sidebarToggle" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={faBars} />
                </Button>

                <div style={{ flexGrow: 1 }}></div>
                <Form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="Search for..."
                            aria-label="Search for..."
                            aria-describedby="btnNavbarSearch"
                        />
                        <Button id="btnNavbarSearch" type="button">
                            <FontAwesomeIcon icon={faSearch} />
                        </Button>
                    </InputGroup>
                </Form>
                <Button variant="link" size="sm" id="themeToggle" className="me-3" onClick={localToggleTheme}>
                    <FontAwesomeIcon icon={theme === "dark" ? faMoon : faSun} id="themeIcon" />
                </Button>
                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    {user || gettingUser ? (
                        <Dropdown>
                            <Dropdown.Toggle
                                as={CustomToggle}
                                id="dropdown-basic"
                                drop="down-centered"
                            ></Dropdown.Toggle>

                            <Dropdown.Menu align="end">
                                <Dropdown.Item href="/user/me">My Profile</Dropdown.Item>
                                <Dropdown.Item href="/user/me#settings">Settings</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Button variant="primary" href="/login" className="me-3">
                            Log In
                        </Button>
                    )}
                </ul>
            </Container>
        </Navbar>
    );
}

export default MyNavbar;

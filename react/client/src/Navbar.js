import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faMoon } from "@fortawesome/free-solid-svg-icons";

function MyNavbar({ userData, toggleTheme, logout }) {
    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            className="sb-topnav navbar navbar-expand navbar-dark bg-dark"
        >
            <Navbar.Brand className="ps-3" href="/">
                WebNovelPlatform
            </Navbar.Brand>
            <Button
                variant="link"
                size="sm"
                className="order-1 order-lg-0 me-4 me-lg-0"
                id="sidebarToggle"
            >
                <FontAwesomeIcon icon={faBars} />
            </Button>
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
            <Button
                variant="link"
                size="sm"
                id="themeToggle"
                className="me-3"
                onClick={toggleTheme}
            >
                <FontAwesomeIcon icon={faMoon} />
            </Button>
            {userData ? (
                "placeholder"
            ) : (
                <Button variant="primary" href="/login" className="me-3">
                    Log In
                </Button>
            )}
        </Navbar>
    );
}

export default MyNavbar;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { getFictions } from "../utils/api";
import LoadingAnimation from "../components/loading";

function Fictions() {
    const [fictions, setFictions] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchInput, setSearchInput] = useState("");
    const [open, setOpen] = useState(false);
    const [advancedSearchInput, setAdvancedSearchInput] = useState({
        title: "",
        author: "",
        keyword: "",
    });

    // Function to handle search
    const searchFictions = () => {
        if (searchInput === "") {
            navigate(`/fictions`);
        } else {
            navigate(`/fictions?keyword=${searchInput}`);
        }
    };

    const advancedSearchFictions = () => {
        let search = "";
        if (advancedSearchInput.title) {
            search += `&title=${advancedSearchInput.title}`;
        }
        if (advancedSearchInput.author) {
            search += `&author=${advancedSearchInput.author}`;
        }
        if (advancedSearchInput.keyword) {
            search += `&keyword=${advancedSearchInput.keyword}`;
        }
        navigate(`/fictions?${search}`);
    };

    useEffect(() => {
        document.title = "Fictions | WebNovelPlatform";

        const fetchDisplayData = async () => {
            const fictionData = await getFictions(location.search);
            setFictions(fictionData);
        };
        fetchDisplayData();
    }, [location.search]);
    if (!fictions) {
        return <LoadingAnimation />;
    }
    return (
        <Container fluid className="my-4 ms-2">
            <Form className="mb-2">
                <InputGroup>
                    <FormControl
                        type="text"
                        placeholder="Search for..."
                        aria-label="Search for..."
                        aria-describedby="btnNavbarSearch"
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Button id="btnNavbarSearch" type="button" onClick={searchFictions}>
                        <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </InputGroup>
            </Form>
            <>
                <div className="d-grid gap-2 mb-2">
                    <Button
                        variant="outline-secondary"
                        onClick={() => setOpen(!open)}
                        aria-controls="advanced-search"
                        aria-expanded={open}
                        style={{ color: "var(--bs-secondary-color)", textAlign: "left" }}
                    >
                        Advanced Search
                    </Button>
                </div>
                <Collapse in={open}>
                    <Form>
                        <Row className="mb-2">
                            <Col className="advancedSearchPaddingFirst">
                                <FormControl
                                    type="text"
                                    placeholder="Title..."
                                    aria-label="Title..."
                                    aria-describedby="btnNavbarSearch"
                                    onChange={(e) =>
                                        setAdvancedSearchInput((prevState) => ({
                                            ...prevState,
                                            title: e.target.value,
                                        }))
                                    }
                                />
                            </Col>
                            <Col className="advancedSearchPadding">
                                <FormControl
                                    type="text"
                                    placeholder="Author..."
                                    aria-label="Author..."
                                    aria-describedby="btnNavbarSearch"
                                    onChange={(e) =>
                                        setAdvancedSearchInput((prevState) => ({
                                            ...prevState,
                                            author: e.target.value,
                                        }))
                                    }
                                />
                            </Col>
                            <Col className="advancedSearchPaddingLast">
                                <FormControl
                                    type="text"
                                    placeholder="Keyword..."
                                    aria-label="Keyword..."
                                    aria-describedby="btnNavbarSearch"
                                    onChange={(e) =>
                                        setAdvancedSearchInput((prevState) => ({
                                            ...prevState,
                                            keyword: e.target.value,
                                        }))
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="d-grid gap-2 mb-2">
                                    <Button
                                        variant="primary"
                                        onClick={() => advancedSearchFictions()}
                                        aria-controls="advanced-search"
                                        aria-expanded={open}
                                        style={{ textAlign: "left" }}
                                    >
                                        Search
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Collapse>
            </>

            <hr />
            {!fictions || fictions.length === 0 ? (
                <h1>No fictions!</h1>
            ) : (
                <ListGroup as="ul">
                    {fictions.map((fiction) => (
                        <ListGroup.Item
                            as="li"
                            key={fiction.id}
                            action
                            onClick={() => navigate(`/fictions/${fiction.id}`)}
                            style={{ padding: 0, cursor: "pointer" }}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img
                                    className="me-4"
                                    src={
                                        fiction.imageLocation
                                            ? fiction.imageLocation
                                            : `${process.env.PUBLIC_URL}/image-placeholder.png`
                                    }
                                    alt="ProfilePicture"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        backgroundColor: "#f0f0f0",
                                        objectFit: "cover",
                                    }}
                                />
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{fiction.title}</div>
                                    <div className="ms-2">{fiction.description}</div>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
}

export default Fictions;

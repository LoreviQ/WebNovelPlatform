import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import { apiEndpoints, axiosAuthed } from "../utils/api";
import { useAuth } from "../utils/auth";
import LoadingAnimation from "../components/loading";

function Fiction(preFetchedFiction) {
    const { fictionid } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const fictionHeaderRef = useRef(null);
    const [fictionData, setFictionData] = useState(preFetchedFiction || null);
    const [chapters, setChapters] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [overflow, setOverflow] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);

    const toggleExpand = () => {
        if (overflow) {
            setIsExpanded(!isExpanded);
        }
    };

    useEffect(() => {
        const fetchDislayData = async () => {
            const { data: fData, fError } = await axiosAuthed("GET", apiEndpoints.fiction(fictionid));
            if (fError) {
                alert("Failed to fetch fiction data");
                navigate(-1);
                return;
            }
            setFictionData(fData);
            const { data: cData, cError } = await axiosAuthed("GET", apiEndpoints.chapters(fictionid));
            if (cError) {
                alert("Failed to fetch chapters");
                navigate(-1);
                return;
            }
            setChapters(cData);
        };
        fetchDislayData();
    }, [fictionid]);

    useEffect(() => {
        if (user && fictionData && fictionData.authorid === user.id) {
            setIsAuthor(true);
        } else {
            setIsAuthor(false);
        }
    }, [user, fictionData]);

    useEffect(() => {
        if (!fictionData) {
            return;
        }
        document.title = fictionData.title + " | WebNovelPlatform";
        if (fictionHeaderRef.current) {
            setOverflow(fictionHeaderRef.current.scrollHeight > fictionHeaderRef.current.clientHeight);
        }
    }, [fictionData]);

    if (!fictionData) {
        return <LoadingAnimation />;
    }
    return (
        <Container fluid className="my-4 ms-2">
            <div
                ref={fictionHeaderRef}
                className={`fictionHeader ${isExpanded ? "fictionHeaderExpanded" : "fictionHeaderTruncated"}`}
                onClick={toggleExpand}
                style={{ cursor: overflow ? "pointer" : "default" }}
            >
                <img
                    className="me-4"
                    src={fictionData.imageLocation || `${process.env.PUBLIC_URL}/image-placeholder.png`}
                    alt="ProfilePicture"
                    style={{
                        width: "auto",
                        maxWidth: "25%",
                        maxHeight: "200px",
                        backgroundColor: "#f0f0f0",
                        objectFit: "cover",
                    }}
                />
                <div style={{ flex: 1 }}>
                    <h1 style={{ textAlign: "center", transform: "translateX(-12.5%)" }}>{fictionData.title}</h1>
                    <p style={{ textAlign: "left", margin: "0 auto", whiteSpace: "pre-line" }}>
                        {fictionData.description}
                    </p>
                </div>
            </div>
            <hr />
            {isAuthor ? (
                <div className="d-grid gap-2">
                    <Button
                        variant="outline-theme"
                        className="mb-2"
                        onClick={() => {
                            navigate(`/fictions/${fictionid}/chapters/new`);
                        }}
                    >
                        Upload Chapters
                    </Button>
                </div>
            ) : null}
            {!chapters || chapters.length === 0 ? (
                <h1>No Chapters!</h1>
            ) : (
                <ListGroup as="ul">
                    <ListGroup.Item
                        as="li"
                        key={"headings"}
                        action
                        onClick={() => navigate(`/`)}
                        style={{ padding: 0, cursor: "pointer" }}
                    >
                        <Row
                            className="ms-auto me-auto align-items-center"
                            style={{ backgroundColor: "var(--bs-tertiary-bg" }}
                        >
                            <Col xs={isAuthor ? 7 : 8}>
                                <div className="fw-bold">Title</div>
                            </Col>
                            <Col xs={4}>
                                <div className="fw-bold">Release Date</div>
                            </Col>
                            {isAuthor ? (
                                <>
                                    <Col xs={1} className="d-flex justify-content-center">
                                        <div className="fw-bold">Published</div>
                                    </Col>
                                </>
                            ) : null}
                        </Row>
                    </ListGroup.Item>
                    {chapters.map((chapter) => (
                        <ListGroup.Item
                            as="li"
                            key={chapter.id}
                            action
                            onClick={() => navigate(`/`)}
                            style={{ padding: 0, cursor: "pointer" }}
                        >
                            <Row className="ms-auto me-auto align-items-center">
                                <Col xs={isAuthor ? 7 : 8}>
                                    <div>{chapter.title}</div>
                                </Col>
                                <Col xs={4} style={{ backgroundColor: "var(--bs-secondary-bg)" }}>
                                    <div>{chapter.published ? chapter.published_at : "-"}</div>
                                </Col>
                                {isAuthor ? (
                                    <>
                                        <Col xs={1} className="d-flex justify-content-center">
                                            {chapter.published ? (
                                                <FontAwesomeIcon icon={faCheck} />
                                            ) : (
                                                <FontAwesomeIcon icon={faXmark} />
                                            )}
                                        </Col>
                                    </>
                                ) : null}
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
            <hr />
            <h1>Comments not yet implemented</h1>
        </Container>
    );
}

export default Fiction;

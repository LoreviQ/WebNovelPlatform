import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

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
    const [sortKey, setSortKey] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");

    const toggleExpand = () => {
        if (overflow) {
            setIsExpanded(!isExpanded);
        }
    };

    const sortChapters = (key) => {
        let direction = sortDirection;
        if (sortKey === key) {
            direction = sortDirection === "asc" ? "desc" : "asc";
        } else {
            direction = "asc";
        }
        setSortDirection(direction);

        const sorted = [...chapters].sort((a, b) => {
            let aValue, bValue;
            switch (key) {
                case "title":
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case "published_at":
                    aValue = a.published ? a.published_at : a.scheduled_at;
                    bValue = b.published ? b.published_at : b.scheduled_at;
                    break;
                case "published":
                    aValue = a.published;
                    bValue = b.published;
                    break;
                default:
                    return 0;
            }
            if (aValue < bValue) return direction === "asc" ? -1 : 1;
            if (aValue > bValue) return direction === "asc" ? 1 : -1;
            return 0;
        });
        setChapters(sorted);
        setSortKey(key);
    };

    const getSortIcon = (key) => {
        if (sortKey === key) {
            return sortDirection === "asc" ? faSortUp : faSortDown;
        }
        return faSort;
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
            if (user && fData && fData.authorid === user.id) {
                setIsAuthor(true);
            } else {
                setIsAuthor(false);
            }
        };
        fetchDislayData();
    }, [user, fictionid]);

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
        <Container fluid className="py-4 px-4">
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
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <h1 style={{ textAlign: "center" }}>{fictionData.title}</h1>
                        <p className="ms-2" style={{ alignSelf: "flex-end", fontStyle: "italic" }}>
                            By <a href={`/user/${fictionData.authorid}/fictions`}>{fictionData.author}</a>
                        </p>
                    </div>
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
                    <ListGroup.Item as="li" key={"headings"} action style={{ padding: 0, cursor: "pointer" }}>
                        <Row
                            className="ms-auto me-auto align-items-center"
                            style={{ backgroundColor: "var(--bs-tertiary-bg" }}
                        >
                            <Col xs={isAuthor ? 6 : 8} onClick={() => sortChapters("title")}>
                                <div className="fw-bold">
                                    Title <FontAwesomeIcon className="ms-2" icon={getSortIcon("title")} />
                                </div>
                            </Col>
                            <Col xs={4} onClick={() => sortChapters("published_at")}>
                                <div className="fw-bold">
                                    Release Date <FontAwesomeIcon className="ms-2" icon={getSortIcon("published_at")} />
                                </div>
                            </Col>
                            {isAuthor ? (
                                <>
                                    <Col xs={2} className="d-flex" onClick={() => sortChapters("published")}>
                                        <div className="fw-bold">
                                            Published{" "}
                                            <FontAwesomeIcon className="ms-2" icon={getSortIcon("published")} />
                                        </div>
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
                            onClick={() => navigate(`/fictions/${fictionid}/chapters/${chapter.id}`)}
                            style={{ padding: 0, cursor: "pointer" }}
                        >
                            <Row className="ms-auto me-auto align-items-center">
                                <Col xs={isAuthor ? 6 : 8}>
                                    <div>{chapter.title}</div>
                                </Col>
                                <Col xs={4} style={{ backgroundColor: "var(--bs-secondary-bg)" }}>
                                    <div>
                                        {chapter.published
                                            ? format(chapter.published_at, "do MMMM yyyy - hh:mm")
                                            : format(chapter.scheduled_at, "do MMMM yyyy - hh:mm")}
                                    </div>
                                </Col>

                                {isAuthor ? (
                                    <>
                                        <Col xs={2} className="d-flex">
                                            {chapter.published ? (
                                                <FontAwesomeIcon className="ms-4" icon={faCheck} />
                                            ) : (
                                                <FontAwesomeIcon className="ms-4" icon={faXmark} />
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

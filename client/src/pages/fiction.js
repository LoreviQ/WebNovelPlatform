import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import ListGroup from "react-bootstrap/esm/ListGroup";

import { apiEndpoints, axiosAuthed } from "../utils/api";
import { useAuth } from "../utils/auth";
import LoadingAnimation from "../components/loading";

function Fiction() {
    const { fictionid } = useParams();
    const { user } = useAuth();
    const fictionHeaderRef = useRef(null);
    const [fictionData, setFictionData] = useState(null);
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
                        variant="outline-secondary"
                        className="mb-2"
                        onClick={() => {
                            // Implement this
                            alert("Not implemented");
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
                    {chapters.map((chapter) => (
                        <ListGroup.Item
                            as="li"
                            key={chapter.id}
                            action
                            onClick={() => navigate(`/`)}
                            style={{ padding: 0, cursor: "pointer" }}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{chapter.title}</div>
                                    <div className="ms-2 userFictionsTextTruncate">{chapter.description}</div>
                                </div>
                            </div>
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

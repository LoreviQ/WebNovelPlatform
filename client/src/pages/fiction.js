import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";

import { apiEndpoints, axiosAuthed } from "../utils/api";
import LoadingAnimation from "../components/loading";

function Fiction() {
    const { fictionid } = useParams();
    const [fictionData, setFictionData] = useState(null);
    const [chapters, setChapters] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const fetchFictionData = async () => {
            const { data, error } = await axiosAuthed("GET", apiEndpoints.fiction(fictionid));
            if (error) {
                alert("Failed to fetch fiction data");
                navigate(-1);
                return;
            }
            setFictionData(data);
        };
        fetchFictionData();
    }, []);

    useEffect(() => {
        if (!fictionData) {
            return;
        }
        document.title = fictionData.title + " | WebNovelPlatform";
    }, [fictionData]);

    if (!fictionData) {
        return <LoadingAnimation />;
    }
    return (
        <Container fluid className="my-4 ms-2">
            <div
                className={`fictionHeader ${isExpanded ? "fictionHeaderExpanded" : "fictionHeaderTruncated"}`}
                onClick={toggleExpand}
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
            {!chapters || chapters.length === 0 ? (
                <h1>Chapters not yet implemented</h1>
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

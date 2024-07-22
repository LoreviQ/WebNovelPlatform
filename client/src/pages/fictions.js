import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import ListGroup from "react-bootstrap/ListGroup";

import { getFictions } from "../utils/api";
import LoadingAnimation from "../components/loading";

function Fictions() {
    const [fictions, setFictions] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Fictions | WebNovelPlatform";

        const fetchDisplayData = async () => {
            const fictionData = await getFictions();
            setFictions(fictionData);
        };
        fetchDisplayData();
    }, []);
    if (!fictions) {
        return <LoadingAnimation />;
    }
    return (
        <Container fluid className="my-4 ms-2">
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

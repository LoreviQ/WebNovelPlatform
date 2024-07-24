import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function Fiction() {
    useEffect(() => {
        document.title = " | WebNovelPlatform";
    }, []);

    return (
        <Container fluid className="my-4 ms-2">
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
            </div>
            <hr />
        </Container>
    );
}

export default Fiction;

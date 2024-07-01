import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useAuth } from "../utils/auth";
import { GetUserByUID } from "../utils/api";

function SubmitFiction() {
    const [displayUser, setDisplayUser] = useState(null);
    const { user, awaitUser } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [validated, setValidated] = useState(false);

    const formSubmission = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        console.log(title, description);
    };

    useEffect(() => {
        document.title = "Submit | WebNovelPlatform";
    }, [userid, user, navigate]);

    return (
        <div className="container-fluid px-4">
            <div style={{ display: "flex", alignItems: "center" }}>
                <h1 className="mt-4">Submit your fiction!</h1>
            </div>
            <hr />
            <Form noValidate validated={validated} onSubmit={formSubmission}>
                <Form.Group as={Row} className="mb-3" controlId="submitTitle">
                    <Form.Label column sm={1}>
                        Title
                    </Form.Label>
                    <Col sm={11}>
                        <Form.Control
                            type="text"
                            placeholder="Title of Fiction"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Col>
                    <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="submitDescription">
                    <Form.Label column sm={1}>
                        Description
                    </Form.Label>
                    <Col sm={11}>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Summary of your fiction"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Col>
                </Form.Group>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flexGrow: 1 }}></div>
                    <Button type="submit" className="mt-4 me-4" variant="theme">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <FontAwesomeIcon className="ms-1 mt-1 me-2" icon={faPlus} size="2x" />
                            <h2 className="mt-2 me-1">Submit</h2>
                        </div>
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default SubmitFiction;

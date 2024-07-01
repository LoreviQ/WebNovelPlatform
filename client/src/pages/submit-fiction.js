import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useAuth } from "../utils/auth";
import { postFiction } from "../utils/api";
import { useNavigateUp } from "../utils/navigation";

function SubmitFiction() {
    const { user, authApi } = useAuth();
    const { userid } = useParams();
    const navigateUp = useNavigateUp();

    const [formData, setFormData] = useState({ title: "", description: "" });
    const [validated, setValidated] = useState(false);

    const formSubmission = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            console.log(formData);
            if (await authApi(postFiction, formData)) {
                navigateUp();
            } else {
                alert("Failed to submit fiction");
            }
        }
        setValidated(true);
    };

    useEffect(() => {
        document.title = "Submit | WebNovelPlatform";
    }, []);

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
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

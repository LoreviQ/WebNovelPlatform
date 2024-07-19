import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useAuth } from "../utils/auth";
import { uploadFileToGCS, postFiction } from "../utils/api";

function SubmitFiction() {
    const { user, authApi } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ title: "", description: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [validated, setValidated] = useState(false);

    const formSubmission = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }
        try {
            let uploadResponse = null;
            if (selectedFile) {
                uploadResponse = await authApi(uploadFileToGCS, [selectedFile]);
                if (!uploadResponse) {
                    throw new Error("Failed to upload image");
                }
            }
            if (!(await authApi(postFiction, [formData, uploadResponse]))) {
                throw new Error("Failed PUT request to API");
            }
            navigate(-1);
        } catch (error) {
            alert("Failed to submit fiction, error: " + error);
        }
        setValidated(true);
    };

    useEffect(() => {
        document.title = "Submit | WebNovelPlatform";
    }, []);

    return (
        <Container fluid className="my-4 ms-2">
            <div style={{ display: "flex", alignItems: "center" }}>
                <h1>Submit your fiction!</h1>
            </div>
            <hr />
            <Form noValidate validated={validated} onSubmit={formSubmission}>
                <Form.Group as={Row} className="mb-3" controlId="submitPicture">
                    <Form.Label column sm={2}>
                        Cover Picture for Fiction
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="submitTitle">
                    <Form.Label column sm={2}>
                        Title
                    </Form.Label>
                    <Col sm={10}>
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
                    <Form.Label column sm={2}>
                        Description
                    </Form.Label>
                    <Col sm={10}>
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
        </Container>
    );
}

export default SubmitFiction;

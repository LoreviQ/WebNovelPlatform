import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { getFictionByID, putFiction, publishFiction } from "../utils/api";
import { useAuth } from "../utils/auth";

function EditFiction() {
    const { fictionid } = useParams();
    const { authApi } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ id: "", title: "", description: "", published: 0, publishedAt: Date() });
    const [validated, setValidated] = useState(false);

    const publish = (event) => {
        setFormData({ ...formData, published: event.target.checked, publishedAt: Date() });
    };

    const formSubmission = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if (await authApi(putFiction, formData)) {
                navigate(-1);
            } else {
                alert("Failed to submit fiction");
            }
        }
        setValidated(true);
    };

    useEffect(() => {
        document.title = "Edit | WebNovelPlatform";

        const fetchFictionData = async () => {
            const fictionData = await getFictionByID(fictionid);
            console.log(fictionData);
            if (!fictionData) {
                alert("Failed to fetch fiction data");
                navigateUp();
                return;
            }
            setFormData({
                id: fictionData.id,
                title: fictionData.title,
                description: fictionData.description,
                published: fictionData.published,
                publishedAt: new Date(fictionData.published_at.String),
            });
        };

        fetchFictionData();
    }, []);

    return (
        <Container fluid className="my-4 ms-2">
            <div style={{ display: "flex", alignItems: "center" }}>
                <h1>{formData.title}</h1>
            </div>
            <hr />
            <Form noValidate validated={validated} onSubmit={formSubmission}>
                <Form.Group as={Row} className="mb-3" controlId="editID">
                    <Form.Label column sm={2}>
                        <h5>UID</h5>
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            placeholder="fictionid"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            required
                        />
                        <div className="ms-2 mt-1">Unique ID for fiction. Appears in URL. Max 20 characters.</div>
                    </Col>
                    <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="editTitle">
                    <Form.Label column sm={2}>
                        <h5>Title</h5>
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
                <Form.Group as={Row} className="mb-3" controlId="editDescription">
                    <Form.Label column sm={2}>
                        <h5>Description</h5>
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
                <Form.Group as={Row} className="mb-3" controlId="editPuiblished">
                    <Form.Label column sm={2}>
                        <h5>Published</h5>
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Check
                            className="mt-2"
                            type="switch"
                            checked={formData.published}
                            onChange={(e) => publish(e)}
                        />
                    </Col>
                </Form.Group>
                {formData.published ? (
                    <Form.Group as={Row} className="mb-3" controlId="editPublishDate">
                        <Form.Label column sm={2}>
                            <h5>Published On</h5>
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                disabled
                                type="text"
                                rows={5}
                                placeholder="Not Published"
                                value={format(formData.publishedAt, "do MMMM yyyy")}
                            />
                        </Col>
                    </Form.Group>
                ) : null}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flexGrow: 1 }}></div>
                    <Button type="submit" className="mt-4 me-4" variant="theme">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <FontAwesomeIcon className="ms-1 mt-1 me-2" icon={faPlus} size="2x" />
                            <h2 className="mt-2 me-1">Update</h2>
                        </div>
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default EditFiction;

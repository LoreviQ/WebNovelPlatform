import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { getFictionByID } from "../utils/api";
import { useNavigateUp } from "../utils/navigation";

function EditFiction() {
    const { fictionid } = useParams();
    const navigateUp = useNavigateUp();

    const [formData, setFormData] = useState({ id: "", title: "", description: "", publishedAt: Date() });
    const [validated, setValidated] = useState(false);

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
            <Form noValidate validated={validated}>
                <Form.Group as={Row} className="mb-3" controlId="submitTitle">
                    <Form.Label column sm={1}>
                        Title
                    </Form.Label>
                    <Col sm={11}>
                        <Form.Control
                            type="text"
                            placeholder="fictionid"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            required
                        />
                    </Col>
                    <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
                </Form.Group>
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
                <Form.Group as={Row} className="mb-3" controlId="submitDescription">
                    <Form.Label column sm={2}>
                        Published On
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

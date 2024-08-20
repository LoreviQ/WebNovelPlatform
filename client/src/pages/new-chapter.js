import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as formik from "formik";
import * as yup from "yup";

import { SimpleEditor } from "../utils/textEditor";
import { apiEndpoints, axiosAuthed } from "../utils/api";

function NewChapter() {
    const { fictionid } = useParams();
    const navigate = useNavigate();
    const { Formik } = formik;

    const [formData, setFormData] = useState({
        title: "",
        body: "",
        scheduledDate: new Date(),
        publishImmediately: false,
    });

    const validationSchema = yup.object().shape({
        title: yup.string().required("Title is required"),
        body: yup.string(),
    });

    const formSubmission = async (values) => {
        try {
            const { data, error } = await axiosAuthed("POST", apiEndpoints.chapters(fictionid), {
                title: values.title,
                body: values.body,
                scheduled_at: values.scheduledDate,
                publish_immidiately: +values.publishImmediately,
            });
            if (error) {
                throw new Error("Failed POST request to API");
            }
            navigate(-1);
        } catch (error) {
            alert("Failed to submit fiction, error: " + error);
        }
    };

    return (
        <Container fluid className="my-4 ms-2">
            <Formik
                validationSchema={validationSchema}
                onSubmit={formSubmission}
                initialValues={formData}
                enableReinitialize
            >
                {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="chapterTitle">
                            <Form.Label>Chapter Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                placeholder="Enter chapter title"
                                value={values.title}
                                onChange={handleChange}
                                isValid={touched.title && !errors.title}
                                isInvalid={!!errors.title}
                            />
                            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="chapterContent" className="my-4">
                            <Form.Label>Chapter Content</Form.Label>
                            <SimpleEditor
                                name="body"
                                onChange={(e) => {
                                    setFieldValue("body", e);
                                }}
                            />
                        </Form.Group>
                        <Row className="my-4">
                            <Col>
                                <Form.Group controlId="scheduledDate">
                                    <Form.Label>Release Date</Form.Label>
                                    <div>
                                        <DatePicker
                                            selected={values.scheduledDate}
                                            name="scheduledDate"
                                            onChange={(date) => setFieldValue("scheduledDate", date)}
                                            showTimeSelect
                                            dateFormat="Pp"
                                            disabled={values.publishImmediately}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="publishImmediately">
                                    <Form.Label></Form.Label>
                                    <Form.Check
                                        type="switch"
                                        label="Publish Immediately"
                                        name="publishImmediately"
                                        checked={values.publishImmediately}
                                        onChange={(e) => {
                                            setFieldValue("publishImmediately", e.target.checked);
                                            setFieldValue("scheduledDate", new Date());
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-grid gap-2">
                            <Button variant="outline-theme" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}

export default NewChapter;

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import * as formik from "formik";
import * as yup from "yup";

import { getFictionByID, putFiction, uploadFileToGCS } from "../utils/api";
import { useAuth } from "../utils/auth";
import LoadingAnimation from "../components/loading";

function EditFiction() {
    const { fictionid } = useParams();
    const { authApi } = useAuth();
    const { Formik } = formik;
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileUrl, setSelectedFileUrl] = useState(null);
    const fileInputRef = useRef(null);

    const validationSchema = yup.object().shape({
        id: yup
            .string()
            .matches(/^[a-z0-9-]+$/, 'ID must be lowercase alphanumeric characters and "-" only')
            .max(20, "ID must be at most 20 characters long")
            .required("ID is required"),
        title: yup.string().required(),
        description: yup.string(),
    });

    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        published: false,
        publishedAt: Date(),
        imageLocation: "",
    });

    const formSubmission = async (values) => {
        const isConfirmed = window.confirm("Are you sure?");
        if (!isConfirmed) {
            return;
        }
        try {
            let uploadResponse = null;
            if (selectedFile) {
                uploadResponse = await authApi(uploadFileToGCS, [selectedFile]);
                if (!uploadResponse) {
                    throw new Error("Failed to get signed URL");
                }
            }
            if (!(await authApi(putFiction, [values, fictionid, uploadResponse]))) {
                throw new Error("Failed PUT request to API");
            }
            navigate(-1);
        } catch (error) {
            alert("Failed to submit fiction, error: " + error);
        }
    };

    const triggerFileInputClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFileUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        document.title = "Edit | WebNovelPlatform";

        const fetchFictionData = async () => {
            const fictionData = await getFictionByID(fictionid);
            if (!fictionData) {
                alert("Failed to fetch fiction data");
                navigate(-1);
                return;
            }
            setFormData({
                id: fictionData.id,
                title: fictionData.title,
                description: fictionData.description,
                published: fictionData.published,
                publishedAt: fictionData.published_at.Valid ? new Date(fictionData.published_at.String) : Date(),
                imageLocation: fictionData.imageLocation,
            });
        };

        fetchFictionData();
    }, []);
    if (formData.id === "") {
        return <LoadingAnimation />;
    }
    return (
        <Container fluid className="my-4 ms-2">
            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                    <img
                        src={
                            selectedFileUrl ||
                            formData.imageLocation ||
                            `${process.env.PUBLIC_URL}/image-placeholder.png`
                        }
                        style={{ maxHeight: "200px", width: "auto" }}
                        alt="ProfilePicture"
                    />
                    <FontAwesomeIcon
                        icon={faPen}
                        style={{
                            position: "absolute",
                            top: "0px",
                            right: "0px",
                            cursor: "pointer",
                        }}
                        onClick={triggerFileInputClick}
                    />
                </div>
                <h1 className="ms-4">{formData.title}</h1>
            </div>
            <input
                id="pictureUpload"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                ref={fileInputRef}
            />
            <hr />
            <Formik
                validationSchema={validationSchema}
                onSubmit={formSubmission}
                initialValues={formData}
                enableReinitialize
            >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="mb-3" controlId="editID">
                            <Form.Label column sm={2}>
                                <h5>UID</h5>
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    type="text"
                                    name="id"
                                    value={values.id}
                                    onChange={handleChange}
                                    isValid={touched.id && !errors.id}
                                    isInvalid={!!errors.id}
                                />
                                <Form.Control.Feedback type="invalid">{errors.id}</Form.Control.Feedback>
                                <div className="ms-2 mt-1">
                                    Unique ID for fiction. Appears in URL. Maximum 20 characters, lowercase
                                    alphanumerics and "-" only.
                                </div>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="editTitle">
                            <Form.Label column sm={2}>
                                <h5>Title</h5>
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    isValid={touched.title && !errors.title}
                                    isInvalid={!!errors.title}
                                />
                                <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="editDescription">
                            <Form.Label column sm={2}>
                                <h5>Description</h5>
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    isValid={touched.description && !errors.description}
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
                                    name="published"
                                    checked={values.published}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Form.Group>
                        {values.published ? (
                            <Form.Group as={Row} className="mb-3" controlId="editPublishDate">
                                <Form.Label column sm={2}>
                                    <h5>Published On</h5>
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        disabled
                                        type="text"
                                        name="publishedAt"
                                        rows={5}
                                        placeholder="Not Published"
                                        value={
                                            values.publishedAt
                                                ? format(values.publishedAt, "do MMMM yyyy")
                                                : "Not Published"
                                        }
                                        isValid={touched.publishedAt && !errors.publishedAt}
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
                )}
            </Formik>
        </Container>
    );
}

export default EditFiction;

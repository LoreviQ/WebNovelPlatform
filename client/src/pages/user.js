import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/esm/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import * as formik from "formik";
import * as yup from "yup";

import { useAuth } from "../utils/auth";
import { apiEndpoints, axiosAuthed, uploadFileToGCS } from "../utils/api";
import LoadingAnimation from "../components/loading";
import Error from "./error";

function User() {
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);
    const { user, awaitUser, authApi, updateUserSessionData } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { Formik } = formik;
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileUrl, setSelectedFileUrl] = useState(null);
    const fileInputRef = useRef(null);
    const formikRef = useRef(null);
    const [w1, w2] = [2, 10];

    const [formData, setFormData] = useState({
        id: "",
        created_at: "",
        updated_at: "",
        email: "",
        image_url: "",
    });

    const profileValidationSchema = yup.object().shape({
        email: yup.string().required(),
    });

    const formSubmission = async (values) => {
        const isConfirmed = window.confirm("Are you sure?");
        if (!isConfirmed) {
            return;
        }
        try {
            let uploadResponse = null;
            if (selectedFile) {
                uploadResponse = await uploadFileToGCS(selectedFile);
                if (!uploadResponse) {
                    throw new Error("Failed to upload image");
                }
            }
            const { data, error } = await axiosAuthed("PUT", apiEndpoints.userProfile, {
                email: values.email,
                image_url: uploadResponse,
            });
            if (error) {
                throw new Error("Failed PUT request to API: " + error);
            }
            updateUserSessionData({
                id: user.id,
                name: user.name,
                image_url: uploadResponse,
            });
            setEdit(!edit);
        } catch (error) {
            alert("Failed to submit fiction, error: " + error);
        }
    };

    const buttonToggle = () => {
        if (edit) {
            formikRef.current.submitForm();
        } else {
            setEdit(!edit);
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
        document.title = "User | WebNovelPlatform";

        const fetchUserData = async () => {
            let uid = userid;
            if (uid === "me") {
                await awaitUser();
                if (!user) {
                    navigate("/login");
                    return;
                }
                uid = user.id;
            }
            const { data, error } = await axiosAuthed("GET", apiEndpoints.user(uid));
            if (error) {
                setError(error);
                return;
            }
            setFormData(data);
        };

        fetchUserData();
    }, []);

    const getDefaultActiveKey = () => {
        const hash = location.hash;
        switch (hash) {
            case "#settings":
                return "settings";
            default:
                return "profile";
        }
    };

    if (error) {
        return <Error statusCode={error} />;
    }
    if (!formData) {
        return <LoadingAnimation />;
    }
    return (
        <Container fluid className="py-4 px-4">
            <div style={{ display: "flex", alignItems: "center" }}>
                <div className="image-edit-container" style={{ position: "relative", display: "inline-block" }}>
                    <img
                        src={
                            selectedFileUrl ||
                            user.image_url ||
                            formData.image_url ||
                            `${process.env.PUBLIC_URL}/profile-default.webp`
                        }
                        style={{ maxHeight: "100px", width: "auto", cursor: edit ? "pointer" : "default" }}
                        alt="ProfilePicture"
                        onClick={edit ? triggerFileInputClick : null}
                    />
                    {edit ? (
                        <>
                            <div className="image-overlay" style={{ pointerEvents: "none", cursor: "pointer" }}></div>
                            <FontAwesomeIcon
                                icon={faPen}
                                style={{
                                    position: "absolute",
                                    top: "0px",
                                    right: "0px",
                                    cursor: "pointer",
                                    pointerEvents: "none",
                                }}
                            />
                        </>
                    ) : null}
                </div>
                <h1 className="ms-4">{formData ? formData.name : ""}</h1>
                <div style={{ flexGrow: 1 }}></div>
                <Button className="me-4" variant="theme" onClick={() => buttonToggle()}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <FontAwesomeIcon className="ms-1 mt-1 me-2" icon={edit ? faPlus : faPen} size="2x" />
                        <h2 className="mt-2 me-1">{edit ? "Update" : "Edit"}</h2>
                    </div>
                </Button>
            </div>
            <input
                id="pictureUpload"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                ref={fileInputRef}
            />
            <hr />
            <Tabs defaultActiveKey={getDefaultActiveKey()} id="userTabs" className="mb-3">
                <Tab eventKey="profile" title="Profile">
                    <Formik
                        innerRef={formikRef}
                        validationSchema={profileValidationSchema}
                        onSubmit={formSubmission}
                        initialValues={formData}
                        enableReinitialize
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group as={Row} className="mb-1" controlId="UID">
                                    <Form.Label column sm={w1}>
                                        <h5>UID</h5>
                                    </Form.Label>
                                    <Col sm={w2}>
                                        <Form.Control type="text" name="id" value={values.id} disabled />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="DateJoined">
                                    <Form.Label column sm={w1}>
                                        <h5>Date Joined</h5>
                                    </Form.Label>
                                    <Col sm={w2}>
                                        <Form.Control
                                            type="text"
                                            name="created_at"
                                            value={values.created_at}
                                            disabled
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="LastActive">
                                    <Form.Label column sm={w1}>
                                        <h5>Last Active</h5>
                                    </Form.Label>
                                    <Col sm={w2}>
                                        <Form.Control
                                            type="text"
                                            name="updated_at"
                                            value={values.updated_at}
                                            disabled
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="Email">
                                    <Form.Label column sm={w1}>
                                        <h5>Email</h5>
                                    </Form.Label>
                                    <Col sm={w2}>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            isInvalid={touched.email && errors.email}
                                            disabled={!edit}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            </Form>
                        )}
                    </Formik>
                </Tab>
                <Tab eventKey="settings" title="Settings">
                    Tab content for Settings
                </Tab>
            </Tabs>
        </Container>
    );
}

export default User;

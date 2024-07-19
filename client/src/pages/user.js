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
import { getUserByUID } from "../utils/api";
import LoadingAnimation from "../components/loading";
import Error from "./error";

function User() {
    const [err404, setErr404] = useState(false);
    const [edit, setEdit] = useState(false);
    const { user, awaitUser } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { Formik } = formik;
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileUrl, setSelectedFileUrl] = useState(null);
    const fileInputRef = useRef(null);

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
                uploadResponse = await authApi(uploadFileToGCS, [selectedFile]);
                if (!uploadResponse) {
                    throw new Error("Failed to upload image");
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
            const userData = await getUserByUID(uid);
            if (!userData) {
                setErr404(true);
                return;
            }
            setFormData(userData);
        };

        fetchUserData();
    }, []);

    const getDefaultActiveKey = () => {
        const hash = location.hash;
        console.log(hash);
        switch (hash) {
            case "#settings":
                return "settings";
            default:
                return "profile";
        }
    };

    if (err404) {
        return <Error statusCode={404} />;
    }
    if (!formData) {
        return <LoadingAnimation />;
    }
    if (edit) {
        return (
            <Container fluid className="my-4 ms-2">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="image-edit-container" style={{ position: "relative", display: "inline-block" }}>
                        <img
                            src={
                                selectedFileUrl ||
                                formData.image_url ||
                                `${process.env.PUBLIC_URL}/profile-default.webp`
                            }
                            style={{ maxHeight: "100px", width: "auto", cursor: "pointer" }}
                            alt="ProfilePicture"
                            onClick={triggerFileInputClick}
                        />
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
                    </div>
                    <h1 className="ms-4">{formData ? formData.name : ""}</h1>
                    <div style={{ flexGrow: 1 }}></div>
                    <Button className="me-4" variant="theme" onClick={() => setEdit(false)}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <FontAwesomeIcon className="ms-1 mt-1 me-2" icon={faPlus} size="2x" />
                            <h2 className="mt-2 me-1">Update</h2>
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
                            validationSchema={profileValidationSchema}
                            onSubmit={formSubmission}
                            initialValues={formData}
                            enableReinitialize
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form noValidate onSubmit={handleSubmit}></Form>
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
    return (
        <Container fluid className="my-4 ms-2">
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    className="me-4"
                    src={
                        formData && formData.image_url
                            ? formData.image_url
                            : `${process.env.PUBLIC_URL}/profile-default.webp`
                    }
                    alt="ProfilePicture"
                />
                <h1>{formData ? formData.name : ""}</h1>
                <div style={{ flexGrow: 1 }}></div>
                <Button className="me-4" variant="theme" onClick={() => setEdit(true)}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <FontAwesomeIcon className="ms-1 mt-1 me-2" icon={faPen} size="2x" />
                        <h2 className="mt-2 me-1">Edit</h2>
                    </div>
                </Button>
            </div>
            <hr />
            <Tabs defaultActiveKey={getDefaultActiveKey()} id="userTabs" className="mb-3">
                <Tab eventKey="profile" title="Profile">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">UID: {formData ? formData.id : ""}</li>
                        <li className="list-group-item">Date Joined: {formData ? formData.created_at : ""}</li>
                        <li className="list-group-item">Last Active: {formData ? formData.updated_at : ""}</li>
                        <li className="list-group-item">Email: {formData ? formData.email : ""}</li>
                    </ul>
                </Tab>
                <Tab eventKey="settings" title="Settings">
                    Tab content for Settings
                </Tab>
            </Tabs>
        </Container>
    );
}

export default User;

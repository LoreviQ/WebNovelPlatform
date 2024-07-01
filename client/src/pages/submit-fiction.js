import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useAuth } from "../utils/auth";
import { GetUserByUID } from "../utils/api";

function SubmitFiction() {
    const [displayUser, setDisplayUser] = useState(null);
    const { user, awaitUser } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Submit | WebNovelPlatform";
    }, [userid, user, navigate]);
    return (
        <div className="container-fluid px-4">
            <div style={{ display: "flex", alignItems: "center" }}>
                <h1 className="mt-4">Submit your fiction!</h1>
                <div style={{ flexGrow: 1 }}></div>
                <Button className="mt-4 me-4" variant="theme">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <FontAwesomeIcon className="ms-1 mt-1 me-2" icon={faPlus} size="2x" />
                        <h2 className="mt-2 me-1">Submit</h2>
                    </div>
                </Button>
            </div>
            <hr />
            <Form>
                <Form.Group className="mb-3" controlId="submitTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="title" placeholder="Title of Fiction" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="submitDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="description" placeholder="Summary of your fiction" />
                </Form.Group>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flexGrow: 1 }}></div>
                    <Button className="mt-4 me-4" variant="theme">
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

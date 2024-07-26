import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faCircleCheck as faCircleCheckSolid,
    faPenToSquare,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck as faCircleCheckRegular } from "@fortawesome/free-regular-svg-icons";

import { useAuth } from "../utils/auth";
import {
    apiEndpoints,
    axiosAuthed,
    getUserByUID,
    getFictionsByAuthorID,
    publishFiction,
    deleteFiction,
} from "../utils/api";
import LoadingAnimation from "../components/loading";
import Error from "./error";

function UserFictions() {
    const [loggedInUser, setLoggedInUser] = useState(false);
    const [error, setError] = useState(false);
    const [displayUser, setDisplayUser] = useState(null);
    const [fictions, setFictions] = useState(null);
    const { user, awaitUser, authApi } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();

    // Publishes the provided fiction
    const publishButton = async (fictionID) => {
        const isConfirmed = window.confirm("Are you sure you want to publish this fiction?");

        if (isConfirmed) {
            await authApi(publishFiction, fictionID);
            navigate(0); // Reloads the current page
        }
    };
    // Deletes the provided fiction
    const deleteButton = async (fictionID) => {
        const userInput = window.prompt(`Please type the fiction ID (${fictionID}) to confirm deletion:`);

        if (userInput === fictionID.toString()) {
            await authApi(deleteFiction, fictionID);
            navigate(0); // Reloads the current page
        } else if (userInput) {
            window.alert("The fiction ID does not match.");
        }
    };

    useEffect(() => {
        document.title = "Fictions | WebNovelPlatform";

        const fetchDisplayData = async () => {
            let uid = userid;
            await awaitUser();
            if (uid === "me" || (user && uid === user.id)) {
                setLoggedInUser(true);
            }
            if (uid === "me") {
                if (!user) {
                    navigate("/login");
                    return;
                }
                setDisplayUser(user);
                const { data, error } = await axiosAuthed(apiEndpoints.getMyFictions);
                console.log(data);
                console.log(error);
                if (error) {
                    setError(error);
                    return;
                }
                setFictions(data);
            } else {
                const userData = await getUserByUID(uid);
                if (!userData) {
                    setError(404);
                    return;
                }
                setDisplayUser(userData);
                const data = await getFictionsByAuthorID(uid);
                setFictions(data);
            }
        };
        fetchDisplayData();
    }, []);
    if (error) {
        return <Error statusCode={error} />;
    }
    if (!fictions) {
        return <LoadingAnimation />;
    }
    return (
        <Container fluid className="my-4 ms-2">
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    className="me-4"
                    src={
                        displayUser && displayUser.image_url
                            ? displayUser.image_url
                            : `${process.env.PUBLIC_URL}/profile-default.webp`
                    }
                    alt="ProfilePicture"
                    style={{ width: "100px", height: "100px" }}
                />
                <h1>{displayUser ? displayUser.name : ""}'s Fictions</h1>
                {displayUser && user && displayUser.id === user.id ? (
                    <>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button className="me-4" variant="theme" onClick={() => navigate("submit")}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <FontAwesomeIcon className="ms-1 mt-1 me-2" icon={faPlus} size="2x" />
                                <h2 className="mt-2 me-1">Submit</h2>
                            </div>
                        </Button>
                    </>
                ) : null}
            </div>
            <hr />
            {!fictions || fictions.length === 0 ? (
                <h1>No fictions!</h1>
            ) : (
                <ListGroup as="ul">
                    {fictions.map((fiction) => (
                        <ListGroup.Item
                            as="li"
                            key={fiction.id}
                            action
                            onClick={() => navigate(`/fictions/${fiction.id}`)}
                            style={{ padding: 0, cursor: "pointer" }}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img
                                    className="me-4"
                                    src={
                                        fiction.imageLocation
                                            ? fiction.imageLocation
                                            : `${process.env.PUBLIC_URL}/image-placeholder.png`
                                    }
                                    alt="ProfilePicture"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        backgroundColor: "#f0f0f0",
                                        objectFit: "cover",
                                    }}
                                />
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{fiction.title}</div>
                                    <div className="ms-2">{fiction.description}</div>
                                </div>
                                {loggedInUser ? (
                                    <ButtonGroup style={{ height: "100px", width: "150px" }} aria-label="ownerTools">
                                        <Button
                                            className="list-item-buttons"
                                            id="fictionPublish"
                                            type="button"
                                            variant="success"
                                            size="lg"
                                            title={fiction.published ? "Fiction Published" : "Publish Fiction"}
                                            disabled={fiction.published === 1}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                publishButton(fiction.id);
                                            }}
                                        >
                                            {fiction.published ? (
                                                <FontAwesomeIcon icon={faCircleCheckRegular} />
                                            ) : (
                                                <FontAwesomeIcon icon={faCircleCheckSolid} />
                                            )}
                                        </Button>
                                        <Button
                                            className="list-item-buttons"
                                            id="fictionEdit"
                                            type="button"
                                            variant="warning"
                                            size="lg"
                                            title="Edit Fiction"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                navigate("/fictions/" + fiction.id + "/edit");
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </Button>
                                        <Button
                                            className="list-item-buttons"
                                            id="fictionDelete"
                                            type="button"
                                            variant="danger"
                                            size="lg"
                                            title="Delete Fiction"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                deleteButton(fiction.id);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </Button>
                                    </ButtonGroup>
                                ) : null}
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
}

export default UserFictions;

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
import { apiEndpoints, axiosAuthed } from "../utils/api";
import buttons from "../utils/buttons";
import LoadingAnimation from "../components/loading";
import Error from "./error";

function UserFictions() {
    const [loggedInUser, setLoggedInUser] = useState(false);
    const [error, setError] = useState(false);
    const [displayUser, setDisplayUser] = useState(null);
    const [fictions, setFictions] = useState(null);
    const [reloadData, setReloadData] = useState(false);
    const { user } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();

    // Publishes the provided fiction
    const publishButton = async (fictionID) => {
        const isConfirmed = window.confirm("Are you sure you want to publish this fiction?");

        if (isConfirmed) {
            const { data, error } = await axiosAuthed("PUT", apiEndpoints.publishFiction(fictionID));
            if (error) {
                alert("Failed to publish fiction: " + error);
                return;
            }
            setReloadData(!reloadData);
        }
    };

    useEffect(() => {
        document.title = "Fictions | WebNovelPlatform";

        const fetchDisplayData = async () => {
            let uid = userid;
            if (uid === "me" || (user && uid === user.id)) {
                setLoggedInUser(true);
            }
            if (uid === "me") {
                if (!user) {
                    navigate("/login");
                    return;
                }
                setDisplayUser(user);
                const { data, error } = await axiosAuthed("GET", apiEndpoints.userFictions("me"));
                if (error) {
                    setError(error);
                    return;
                }
                setFictions(data);
            } else {
                console.log("Fetching user data");
                const { data: userData, error: userError } = await axiosAuthed("GET", apiEndpoints.user(uid));
                if (userError) {
                    setError(userError);
                    return;
                }
                setDisplayUser(userData);
                console.log("Fetching user fictions");
                const { data: fictionsData, error: fictionsError } = await axiosAuthed(
                    "GET",
                    apiEndpoints.userFictions(uid)
                );
                if (fictionsError) {
                    setError(fictionsError);
                    return;
                }
                setFictions(fictionsData);
            }
        };
        fetchDisplayData();
    }, [reloadData]);
    if (error) {
        return <Error statusCode={error} />;
    }
    if (!fictions) {
        return <LoadingAnimation />;
    }
    return (
        <Container fluid className="py-4 px-4">
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
                                        flexShrink: 0,
                                    }}
                                />
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{fiction.title}</div>
                                    <div className="ms-2 userFictionsTextTruncate">{fiction.description}</div>
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
                                                buttons.deleteFiction(fiction.id);
                                                setReloadData(!reloadData);
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

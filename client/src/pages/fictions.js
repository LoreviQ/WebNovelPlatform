import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCircleCheck, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../utils/auth";
import { getUserByUID, getFictionsByAuthorID, getMyFictions, publishFiction } from "../utils/api";
import LoadingAnimation from "../components/loading";
import Error from "./error";

function Fictions() {
    const [loggedInUser, setLoggedInUser] = useState(false);
    const [err404, setErr404] = useState(false);
    const [displayUser, setDisplayUser] = useState(null);
    const [fictions, setFictions] = useState(null);
    const { user, awaitUser, authApi } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();

    const publishButton = async (fictionID) => {
        await authApi(publishFiction, fictionID);
    };

    useEffect(() => {
        document.title = "Fictions | WebNovelPlatform";

        const fetchDisplayData = async () => {
            let uid = userid;
            let fictionData;
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
                fictionData = await authApi(getMyFictions);
            } else {
                const userData = await getUserByUID(uid);
                if (!userData) {
                    setErr404(true);
                    return;
                }
                setDisplayUser(userData);
                fictionData = await getFictionsByAuthorID(uid);
            }
            setFictions(fictionData);
        };
        fetchDisplayData();
    }, []);
    if (err404) {
        return <Error statusCode={404} />;
    }
    if (!fictions) {
        return <LoadingAnimation />;
    }
    return (
        <Container fluid className="my-4 ms-2">
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    className="me-4"
                    src={`${process.env.PUBLIC_URL}/profile-default.webp`}
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
                            style={{ padding: 0 }}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img
                                    className="me-4"
                                    src={`${process.env.PUBLIC_URL}/image-placeholder.png`}
                                    alt="ProfilePicture"
                                    style={{ width: "100px", height: "100px", backgroundColor: "#f0f0f0" }}
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
                                            <FontAwesomeIcon icon={faCircleCheck} inverse={fiction.published === 1} />
                                        </Button>
                                        <Button
                                            className="list-item-buttons"
                                            id="fictionEdit"
                                            type="button"
                                            variant="warning"
                                            size="lg"
                                            title="Edit Fiction"
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

export default Fictions;

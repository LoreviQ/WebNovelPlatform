import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../utils/auth";
import { getUserByUID, getFictionsByAuthorID, getMyFictions } from "../utils/api";
import LoadingAnimation from "../components/loading";
import Error from "./error";

function Fictions() {
    const [err404, setErr404] = useState(false);
    const [displayUser, setDisplayUser] = useState(null);
    const [fictions, setFictions] = useState(null);
    const { user, awaitUser, authApi } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Fictions | WebNovelPlatform";

        const fetchDisplayData = async () => {
            let uid = userid;
            let fictionData;
            if (uid === "me") {
                await awaitUser();
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
        <div className="container-fluid px-4">
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    className="mt-4 me-4"
                    src={`${process.env.PUBLIC_URL}/profile-default.webp`}
                    alt="ProfilePicture"
                />
                <h1 className="mt-4">{displayUser ? displayUser.name : ""}'s Fictions</h1>
                {displayUser && user && displayUser.id === user.id ? (
                    <>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button className="mt-4 me-4" variant="theme" onClick={() => navigate("submit")}>
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
                    <ListGroup.Item as="li" active>
                        Cras justo odio
                    </ListGroup.Item>
                    <ListGroup.Item as="li">Dapibus ac facilisis in</ListGroup.Item>
                    <ListGroup.Item as="li" disabled>
                        Morbi leo risus
                    </ListGroup.Item>
                    <ListGroup.Item as="li">Porta ac consectetur ac</ListGroup.Item>
                </ListGroup>
            )}
        </div>
    );
}

export default Fictions;

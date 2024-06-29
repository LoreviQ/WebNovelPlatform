import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../utils/auth";
import { GetUserByUID, getFictionsByAuthorID } from "../utils/api";
import LoadingAnimation from "../components/loading";

function SubmitFiction() {
    const [displayUser, setDisplayUser] = useState(null);
    const [fictions, setFictions] = useState(null);
    const { user, awaitUser } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Fictions | WebNovelPlatform";

        const fetchFictions = async () => {
            let uid = userid;
            if (uid === "me") {
                await awaitUser();
                if (!user) {
                    navigate("/login");
                    return;
                }
                uid = user.id;
            }
            const userData = await GetUserByUID(uid);
            if (!userData) navigate("/404");
            setDisplayUser(userData);
            const fictionData = await getFictionsByAuthorID(uid);
            setFictions(fictionData);
        };
        fetchFictions();
    }, [userid, user, navigate]);
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
                {displayUser && displayUser.id === user.id ? (
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
            {!fictions || fictions.length === 0 ? <h1>No fictions!</h1> : <h1>Insert fictions here</h1>}
        </div>
    );
}

export default SubmitFiction;

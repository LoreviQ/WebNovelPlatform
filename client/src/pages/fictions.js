import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import { GetUserByUID, getFictionsByAuthorID } from "../utils/api";
import LoadingAnimation from "../components/loading";

function Fictions() {
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
            if (fictionData === false) navigate("/404");
            setFictions(fictionData);
            console.log(fictionData);
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
            </div>
            <hr />
        </div>
    );
}

export default Fictions;

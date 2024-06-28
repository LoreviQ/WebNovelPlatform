import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import { getFictionsByAuthorID } from "../utils/api";
import LoadingAnimation from "../components/loading";

function Fictions() {
    const [fictions, setFictions] = useState(null);
    const { user, gettingUser } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Fictions | WebNovelPlatform";

        const fetchFictions = async () => {
            let uid = userid;

            // Wait for gettingUser to be false if uid is 'me'
            if (uid === "me") {
                await new Promise((resolve) => {
                    const checkUserInterval = setInterval(() => {
                        if (!gettingUser) {
                            clearInterval(checkUserInterval);
                            resolve();
                        }
                    }, 5);
                });

                if (!user) {
                    navigate("/login");
                    return;
                }
                uid = user.id;
            }

            const fictionData = await getFictionsByAuthorID(uid);
            if (fictionData === false) navigate("/404");
            setFictions(fictionData);
            console.log(fictionData);
        };
        fetchFictions();
    }, [userid, user, gettingUser, navigate]);
    if (!fictions) {
        return <LoadingAnimation />;
    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">{user ? user.name : ""}'s Fictions</h1>
            <hr />
        </div>
    );
}

export default Fictions;

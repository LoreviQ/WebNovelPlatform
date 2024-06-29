import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../utils/auth";
import { GetUserByUID } from "../utils/api";

function SubmitFiction() {
    const [displayUser, setDisplayUser] = useState(null);
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
        };
        fetchFictions();
    }, [userid, user, navigate]);
    return (
        <div className="container-fluid px-4">
            <div style={{ display: "flex", alignItems: "center" }}>
                <h1 className="mt-4">Submit your fiction!</h1>
            </div>
            <hr />
            <h1>Form here</h1>
        </div>
    );
}

export default SubmitFiction;

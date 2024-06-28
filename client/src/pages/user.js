import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useAuth } from "../utils/auth";
import { GetUserByUID } from "../utils/api";
import LoadingAnimation from "../components/loading";

function User() {
    // get userid from url or logged in user
    const [displayUser, setDisplayUser] = useState(null);
    const { user, gettingUser } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "User | WebNovelPlatform";

        const fetchUserData = async () => {
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

            const userData = await GetUserByUID(uid);
            if (!userData) navigate("/404");
            setDisplayUser(userData);
        };

        fetchUserData();
    }, [userid, user, gettingUser, navigate]);
    if (!displayUser) {
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
                <h1 className="mt-4">{displayUser ? displayUser.name : ""}</h1>
            </div>
            <hr />
            <Tabs defaultActiveKey="profile" id="userTabs" className="mb-3">
                <Tab eventKey="profile" title="Profile">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Date Joined: {displayUser ? displayUser.created_at : ""}</li>
                        <li className="list-group-item">Last Active: {displayUser ? displayUser.updated_at : ""}</li>
                        <li className="list-group-item">Email: {displayUser ? displayUser.email : ""}</li>
                    </ul>
                </Tab>
                <Tab eventKey="settings" title="Settings">
                    Tab content for Settings
                </Tab>
            </Tabs>
        </div>
    );
}

export default User;

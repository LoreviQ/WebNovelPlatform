import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useAuth } from "../utils/auth";
import { getUserByUID } from "../utils/api";
import LoadingAnimation from "../components/loading";
import Error from "./error";

function User() {
    const [err404, setErr404] = useState(false);
    const [displayUser, setDisplayUser] = useState(null);
    const { user, awaitUser } = useAuth();
    const { userid } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = "User | WebNovelPlatform";

        const fetchUserData = async () => {
            let uid = userid;
            if (uid === "me") {
                await awaitUser();
                if (!user) {
                    navigate("/login");
                    return;
                }
                uid = user.id;
            }
            const userData = await getUserByUID(uid);
            if (!userData) {
                setErr404(true);
                return;
            }
            setDisplayUser(userData);
        };

        fetchUserData();
    }, []);

    const getDefaultActiveKey = () => {
        const hash = location.hash;
        console.log(hash);
        switch (hash) {
            case "#settings":
                return "settings";
            default:
                return "profile";
        }
    };

    if (err404) {
        return <Error statusCode={404} />;
    }
    if (!displayUser) {
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
                />
                <h1>{displayUser ? displayUser.name : ""}</h1>
            </div>
            <hr />
            <Tabs defaultActiveKey={getDefaultActiveKey()} id="userTabs" className="mb-3">
                <Tab eventKey="profile" title="Profile">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">UID: {displayUser ? displayUser.id : ""}</li>
                        <li className="list-group-item">Date Joined: {displayUser ? displayUser.created_at : ""}</li>
                        <li className="list-group-item">Last Active: {displayUser ? displayUser.updated_at : ""}</li>
                        <li className="list-group-item">Email: {displayUser ? displayUser.email : ""}</li>
                    </ul>
                </Tab>
                <Tab eventKey="settings" title="Settings">
                    Tab content for Settings
                </Tab>
            </Tabs>
        </Container>
    );
}

export default User;

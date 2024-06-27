import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/auth";
import LoadingAnimation from "../components/loading";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function User() {
    let { userid } = useParams();
    if (!userid) {
        const { user, gettingUser } = useAuth();
        while (gettingUser) {
            return <LoadingAnimation />;
        }
        if (!user) {
            window.location.href = "/login";
            return <h1>Redirecting...</h1>;
        }
        userid = user.id;
    }
    useEffect(() => {
        document.title = "User | WebNovelPlatform";
    }, []);
    return (
        <div className="container-fluid px-4">
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    className="mt-4 me-4"
                    src={`${process.env.PUBLIC_URL}/profile-default.webp`}
                    alt="ProfilePicture"
                />
                <h1 className="mt-4">User ID: </h1>
            </div>
            <hr />
            <Tabs defaultActiveKey="profile" id="userTabs" className="mb-3">
                <Tab eventKey="profile" title="Profile">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Date Joined: </li>
                        <li className="list-group-item">Last Active: </li>
                        <li className="list-group-item">Email: </li>
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

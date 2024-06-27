import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/auth";
import LoadingAnimation from "../components/loading";

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
            <ul className="nav nav-tabs" id="userTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link active"
                        id="profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#profile"
                        type="button"
                        role="tab"
                        aria-controls="profile"
                        aria-selected="true"
                    >
                        Profile
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="settings-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#settings"
                        type="button"
                        role="tab"
                        aria-controls="settings"
                        aria-selected="false"
                    >
                        Settings
                    </button>
                </li>
            </ul>
            <div className="tab-content" id="userTabContent">
                <div className="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Date Joined: </li>
                        <li className="list-group-item">Last Active: </li>
                        <li className="list-group-item">Email: </li>
                    </ul>
                </div>
                <div className="tab-pane fade" id="settings" role="tabpanel" aria-labelledby="settings-tab"></div>
            </div>
        </div>
    );
}

export default User;

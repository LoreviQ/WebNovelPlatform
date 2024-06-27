import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/auth";

function User() {
    let { userid } = useParams();
    if (!userid) {
        const { user, gettingUser } = useAuth();
        while (gettingUser) {
            return <h1>Loading...</h1>;
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
    return <h1>{userid}</h1>;
}
export default User;

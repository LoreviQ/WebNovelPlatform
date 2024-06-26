import React, { useEffect } from "react";
import MyFooter from "../components/footer";
import MyHead from "../components/head";
import { initTheme } from "../utils/theme";
import { AuthProvider } from "./../utils/auth";

function ForgotPassword() {
    return (
        <AuthProvider>
            <ForgotPasswordAuthed />
        </AuthProvider>
    );
}

function ForgotPasswordAuthed() {
    useEffect(() => {
        document.title = "ForgotPassword | WebNovelPlatform";
        initTheme();
    }, []);

    return (
        <>
            <MyHead />
            <div className="sb-sidenav-dark">
                <div id="layoutAuthentication">
                    <MyFooter />
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;

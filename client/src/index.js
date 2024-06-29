import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import * as Pages from "./pages";

import "./css/styles.css";

const isSidebarToggled = localStorage.getItem("sb|sidebar-toggle") === "true";
if (isSidebarToggled) {
    document.body.classList.add("sb-sidenav-toggled");
} else {
    document.body.classList.remove("sb-sidenav-toggled");
}

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App Page={Pages.Index} />} />
                <Route path="index" element={<App Page={Pages.Index} />} />
                <Route path="home" element={<App Page={Pages.Index} />} />
                <Route path="login" element={<Pages.Login />} />
                <Route path="register" element={<Pages.Register />} />
                <Route path="forgotpassword" element={<Pages.ForgotPassword />} />
                <Route path="user/:userid" element={<App Page={Pages.User} />} />
                <Route path="user/:userid/fictions" element={<App Page={Pages.Fictions} />} />
                <Route path="user/:userid/fictions/submit" element={<App Page={Pages.SubmitFiction} />} />
                <Route path="401" element={<App Page={Pages.Error} pageProps={{ statusCode: 401 }} />} />
                <Route path="403" element={<App Page={Pages.Error} pageProps={{ statusCode: 403 }} />} />
                <Route path="404" element={<App Page={Pages.Error} pageProps={{ statusCode: 404 }} />} />
                <Route path="500" element={<App Page={Pages.Error} pageProps={{ statusCode: 500 }} />} />
                <Route path="*" element={<App Page={Pages.Error} pageProps={{ statusCode: 404 }} />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AppRouter />
    </React.StrictMode>
);

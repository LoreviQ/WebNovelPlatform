import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import * as Pages from "./pages";
import { AuthProvider, PrivateRoute, UserIDRouter, PrivateRouteFictionId } from "./utils/auth";

import "./css/styles.css";

const isSidebarToggled = localStorage.getItem("sb|sidebar-toggle") === "true";
if (isSidebarToggled) {
    document.body.classList.add("sb-sidenav-toggled");
} else {
    document.body.classList.remove("sb-sidenav-toggled");
}

function AppRouter() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App Page={Pages.Index} />} />
                    <Route path="index" element={<App Page={Pages.Index} />} />
                    <Route path="home" element={<App Page={Pages.Index} />} />
                    <Route path="login" element={<Pages.Login />} />
                    <Route path="register" element={<Pages.Register />} />
                    <Route path="forgotpassword" element={<Pages.ForgotPassword />} />
                    <Route
                        path="user/:userid"
                        element={
                            <UserIDRouter>
                                <App Page={Pages.User} pageProps={{ edit: false }} />
                            </UserIDRouter>
                        }
                    />
                    <Route
                        path="user/:userid/fictions"
                        element={
                            <PrivateRoute>
                                <App Page={Pages.UserFictions} />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="user/:userid/fictions/submit"
                        element={
                            <UserIDRouter>
                                <App Page={Pages.SubmitFiction} />
                            </UserIDRouter>
                        }
                    />
                    <Route
                        path="fictions/:fictionid/Edit"
                        element={
                            <PrivateRouteFictionId>
                                <App Page={Pages.EditFiction} />
                            </PrivateRouteFictionId>
                        }
                    />
                    <Route path="401" element={<App Page={Pages.Error} pageProps={{ statusCode: 401 }} />} />
                    <Route path="403" element={<App Page={Pages.Error} pageProps={{ statusCode: 403 }} />} />
                    <Route path="404" element={<App Page={Pages.Error} pageProps={{ statusCode: 404 }} />} />
                    <Route path="500" element={<App Page={Pages.Error} pageProps={{ statusCode: 500 }} />} />
                    <Route path="*" element={<App Page={Pages.Error} pageProps={{ statusCode: 404 }} />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AppRouter />
    </React.StrictMode>
);

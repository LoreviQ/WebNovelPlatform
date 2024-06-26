import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Index from "./pages/index";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App Page={Index} />}>
                    <Route path="index" element={<App Page={Index} />} />
                    <Route path="home" element={<App Page={Index} />} />
                </Route>
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

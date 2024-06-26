import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Index from "./pages/index";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App Page={Index} />
    </React.StrictMode>
);

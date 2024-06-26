// Import necessary modules
const express = require("express");
const session = require("express-session");
const fs_p = require("fs").promises;
const path = require("path");
require("dotenv").config();

// declare global variables
const app = express();
const httpApp = express();
const PORT = process.env.PORT || 3000;
const apiBaseUrl = process.env.API_URL || "localhost:8080";

// Use the express-session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, httpOnly: true },
    })
);

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, "build")));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//login endpoint
app.post("/login", async (req, res) => {
    try {
        const response = await fetch(apiBaseUrl + "/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: req.body.email,
                password: req.body.password,
            }),
        });
        const data = await response.json();
        if (response.status === 200) {
            req.session.user = data.user;
            req.session.auth = data.auth;
            res.status(200).send("Login successful");
        } else {
            res.status(401).send("Login failed");
        }
    } catch (e) {
        console.error("Failed to login:", e);
        res.status(500).send("An error occurred");
    }
});

//logout endpoint
app.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

// Serve React App for all other GET requests
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
if (process.env.K_SERVICE) {
    // Cloud Run detected, set up for HTTP
    app.listen(PORT, () => {
        console.log(`Application listening on port ${PORT}`);
    });
} else {
    // Host seperate endpoints for https and http if running locally
    const https = require("https");
    const http = require("http");
    const fs = require("fs");
    const HTTP_PORT = process.env.HTTP_PORT || 3330;

    https
        .createServer(
            {
                key: fs.readFileSync("server.key"),
                cert: fs.readFileSync("server.cert"),
            },
            app
        )
        .listen(PORT, function () {
            console.log(`Server is running on https://localhost:${PORT}`);
        });

    httpApp.get("*", function (req, res) {
        const hostWithoutPort = req.headers.host.split(":")[0];
        const httpsUrl = `https://${hostWithoutPort}:${PORT}${req.url}`;
        res.redirect(httpsUrl);
    });

    http.createServer(httpApp).listen(HTTP_PORT, function () {
        console.log(`HTTP server running on http://localhost:${HTTP_PORT} and redirecting to HTTPS on port ${PORT}`);
    });
}

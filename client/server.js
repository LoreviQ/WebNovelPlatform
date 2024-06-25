const express = require("express");
const session = require("express-session");
const fs = require("fs");
const fs_p = require("fs").promises;
const https = require("https");
const http = require("http");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const app = express();
const httpApp = express();
const HTTP_PORT = process.env.HTTP_PORT || 8880;
const HTTPS_PORT = process.env.PORT || 8000;
const apiBaseUrl = process.env.API_URL || "localhost:8080"; // Change this to your actual API base URL

app.set("view engine", "ejs");

// Use the express-session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, httpOnly: true },
    })
);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies
app.use(express.json());

//login endpoint
app.post("/login", async (req, res) => {
    try {
        const response = await axios.post(apiBaseUrl + "/v1/login", {
            email: req.body.email,
            password: req.body.password,
        });
        if (response.status === 200) {
            req.session.user = response.data;
            res.status(200).send("Login successful");
        } else {
            res.status(401).send("Login failed");
        }
    } catch (e) {
        console.error("Failed to login:", e);
        res.status(500).send("An error occurred");
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

// Serve User Pages Based on url
app.get("/user/:userId", async (req, res) => {
    var userId = req.params.userId;
    if (userId === "me") {
        res.redirect("/user/" + req.session.user.id);
    }
    const userData = await getUserByUID(userId);
    try {
        res.render("template", {
            mainComponent: "pages/user.ejs",
            userData: userData,
        });
    } catch (e) {
        console.error("Failed to fetch user data:", e);
        sendError(res, 500);
    }
});

app.get("/user/:userId/fictions", (req, res) => {
    var userId = req.params.userId;
    if (userId === "currentUser") {
        userId = req.session.user.id;
    }
    res.render("template", {
        mainComponent: "pages/user.ejs",
        userId: userId,
    });
});

// Automatically serve EJS or HTML files based on the URL
app.get("/:page", async (req, res) => {
    const page = req.params.page;
    // Check if the requested URL has a file extension
    if (/\.\w+$/.test(page)) {
        // If a file extension exists, skip to the next middleware
        return res.status(404).send("Not found");
    }

    const ejsFilePath = path.join(__dirname, "views", "pages", `${page}.ejs`);
    const htmlFilePath = path.join(__dirname, "public", `${page}.html`);
    try {
        // Check if the EJS file exists using fs.access
        await fs_p.access(ejsFilePath);
        res.render("template", {
            mainComponent: ejsFilePath,
            userData: req.session.user,
        });
    } catch (e) {
        // If the EJS file does not exist, check for the HTML file
        try {
            await fs_p.access(htmlFilePath);
            res.sendFile(htmlFilePath);
        } catch (e) {
            // If neither file exists, handle the error (e.g., send a 404 response)
            console.error("Failed to find page:", e);
            sendError(res, 404);
        }
    }
});

// Serve the index page
app.get("/", (req, res) => {
    res.render("template", {
        mainComponent: "pages/index.ejs",
        userData: req.session.user,
    });
});

https
    .createServer(
        {
            key: fs.readFileSync("server.key"),
            cert: fs.readFileSync("server.cert"),
        },
        app
    )
    .listen(HTTPS_PORT, function () {
        console.log(`Server is running on https://localhost:${HTTPS_PORT}`);
    });

httpApp.get("*", function (req, res) {
    const hostWithoutPort = req.headers.host.split(":")[0];
    const httpsUrl = `https://${hostWithoutPort}:${HTTPS_PORT}${req.url}`;
    res.redirect(httpsUrl);
});

http.createServer(httpApp).listen(HTTP_PORT, function () {
    `HTTP server running on http://localhost:${HTTP_PORT} and redirecting to HTTPS on port ${HTTPS_PORT}`;
});

function sendError(res, status) {
    if (status) {
        try {
            res.sendFile(`public/${status}.html`, { root: __dirname });
        } catch (e) {
            res.status(status).send("An error occurred");
        }
    } else {
        res.status(status).send("An error occurred");
    }
}

// Returns json of user by uid
async function getUserByUID(uid) {
    const response = await fetch(apiBaseUrl + "/v1/users/" + uid, {
        method: "GET",
    });
    if (response.status === 200) {
        body = await response.json();
        return body;
    }
    return null;
}

function attachJwt(req, res, next) {
    if (req.session.user.token) {
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${req.session.user.token}`;
    }
    next();
}

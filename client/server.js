const fs = require("fs").promises;
const express = require("express");
const session = require("express-session");
const path = require("path");
const axios = require("axios");
const { stat } = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
const apiBaseUrl = "https://webnovelapi-y5hewbdc4a-nw.a.run.app"; // Change this to your actual API base URL

app.set("view engine", "ejs");

// Use the express-session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true, httpOnly: true },
    })
);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies
app.use(express.json());

//login endpoint
app.post("/login", async (req, res) => {
    console.log("Attempting login...");
    try {
        const response = await axios.post(apiBaseUrl + "/v1/login", {
            email: req.body.email,
            password: req.body.password,
        });
        if (response.status === 200) {
            console.log(response.data);
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
    const userId = req.params.userId;
    try {
        const userData = await getUserByUID(userId);
        console.log(userData);
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
    const userId = req.params.userId;
    res.render("template", {
        mainComponent: "pages/user.ejs",
        userId: userId,
    });
});

// Automatically serve EJS or HTML files based on the URL
app.get("/:page", async (req, res) => {
    const page = req.params.page;
    const ejsFilePath = path.join(__dirname, "views", "pages", `${page}.ejs`);
    const htmlFilePath = path.join(__dirname, "public", `${page}.html`);
    try {
        // Check if the EJS file exists using fs.access
        await fs.access(ejsFilePath);
        res.render("template", {
            mainComponent: ejsFilePath,
        });
    } catch (e) {
        // If the EJS file does not exist, check for the HTML file
        try {
            await fs.access(htmlFilePath);
            res.sendFile(htmlFilePath);
        } catch (e) {
            // If neither file exists, handle the error (e.g., send a 404 response)
            sendError(res, 404);
        }
    }
});

// Serve the index page
app.get("/", (req, res) => {
    res.render("template", { mainComponent: "pages/index.ejs" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
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

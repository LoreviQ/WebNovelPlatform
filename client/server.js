const fs = require("fs").promises;
const express = require("express");
const path = require("path");
const { stat } = require("fs");

const app = express();
const PORT = process.env.PORT || 8000;
const apiBaseUrl = "https://webnovelapi-y5hewbdc4a-nw.a.run.app"; // Change this to your actual API base URL

app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve User Pages Based on url
app.get("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const userData = await getUserByUID(userId);
        console.log(userData);
        res.render("template", {
            mainComponent: "pages/user.ejs",
            userData: "userData",
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

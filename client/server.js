const fs = require("fs").promises;
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve User Pages Based on url
app.get("/user/:userId", (req, res) => {
    const userId = req.params.userId;
    res.render("template", {
        mainComponent: "pages/user.ejs",
        userId: "userId",
    });
});

app.get("/user/:userId/fictions", (req, res) => {
    const userId = req.params.userId;
    res.render("template", {
        mainComponent: "pages/user.ejs",
        userId: userId,
    });
});

// Serve HTML files without the .html extension
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
            res.sendFile("public/404.html", { root: __dirname });
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

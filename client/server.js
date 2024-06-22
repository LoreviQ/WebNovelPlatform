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
app.get("/:page", (req, res) => {
    const page = req.params.page;
    res.render("template", { mainComponent: `pages/${page}.ejs` });
});

// Catch-all route to serve index for any other route
app.get("*", (req, res) => {
    res.render("template", { mainComponent: "pages/index.ejs" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

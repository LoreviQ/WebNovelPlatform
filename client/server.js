const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve User Pages Based on url
app.get("/user/:userId/fictions", (req, res) => {
    const userId = req.params.userId;
    res.render("user_fictions", { userId: userId });
});

// Serve HTML files without the .html extension
app.get("/:page", (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, "public", `${page}.html`));
});

// Catch-all route to serve index.html for any other route
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

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

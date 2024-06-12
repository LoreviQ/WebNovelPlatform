const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Example API route
/*app.get("/api/data", (req, res) => {
    const data = [
        { title: "Item 1", description: "Description for item 1" },
        { title: "Item 2", description: "Description for item 2" },
        { title: "Item 3", description: "Description for item 3" },
    ];
    res.json(data);
});*/

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

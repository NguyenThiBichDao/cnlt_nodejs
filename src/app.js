// =====================================
// APP ENTRYPOINT
// =====================================
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// =====================================
// ROUTES
// =====================================
const apiRoutes = require("./routes/index");

const app = express();

// =====================================
// MIDDLEWARE
// =====================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use('/uploads', express.static(path.join(__dirname, "../uploads")));

// =====================================
// API ROUTES
// =====================================
app.use("/api", apiRoutes);

// =====================================
// ROOT HEALTHCHECK
// =====================================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        project: "E-BIKES Rental System",
        message: "API is running successfully"
    });
});

// =====================================
// 404 NOT FOUND
// =====================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// =====================================
// GLOBAL ERROR HANDLER
// =====================================
app.use((err, req, res, next) => {
    console.error("🔥 Application error:", err.stack || err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

module.exports = app;

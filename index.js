import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import { connectDB } from "./src/config/db.js";
import { pool } from "./src/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Security
app.use(helmet());
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

const startServer = async () => {
    try {
        // Check database connection
        connectDB();
        // Start server
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(
                `📝 Environment: ${process.env.NODE_ENV || "development"}`,
            );
            console.log(`\nAPI Endpoints:`);
            console.log(`  POST   /api/auth/register`);
            console.log(`  POST   /api/auth/login`);
            console.log(`  GET    /api/users`);
            console.log(`  GET    /api/users/:id`);
            console.log(`  PUT    /api/users/:id`);
            console.log(`  POST   /api/users/:id/avatar`);
            console.log(`  DELETE /api/users/:id`);
            console.log(`  GET    /api/health\n`);
        });
    } catch (err) {
        console.error("✗ Failed to start server:", err);
        process.exit(1);
    }
};

startServer();

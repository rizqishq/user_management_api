import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import { connectDB } from "./src/config/db.js";
import { register, login } from "./src/controllers/authController.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

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
app.use("/api/user", userRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/register", (req, res) => register(req, res));
app.post("/login", (req, res) => login(req, res));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

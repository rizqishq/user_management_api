import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { register, login } from "./src/controllers/authController.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/register", (req, res) => register(req, res));
app.post("/login", (req, res) => login(req, res));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

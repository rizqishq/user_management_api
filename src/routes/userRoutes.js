import express from "express";
import {
    getUsers,
    getUserProfile,
    updateProfile,
    uploadAvatar,
    deleteUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getUserProfile);
router.put("/:id", verifyToken, updateProfile);
router.post("/:id/avatar", verifyToken, upload.single("file"), uploadAvatar);
router.delete("/:id", verifyToken, deleteUser);

export default router;

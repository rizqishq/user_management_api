import { pool } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { getUserById, getAllUsers } from "../models/userModel.js";
import { validateEmail } from "../utils/validator.js";

// Get all users (public data)
export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json({
            success: true,
            data: users,
        });
    } catch (err) {
        console.error("Get users error:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
};

// Get user profile by ID
export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (err) {
        console.error("Get user profile error:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching user profile",
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
};

// Update user profile (only own profile)
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From JWT token
        const { id: paramId } = req.params;
        const { username, email } = req.body;

        // Check authorization - user can only update their own profile
        if (parseInt(userId) !== parseInt(paramId)) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own profile",
            });
        }

        // Validation
        if (!username && !email) {
            return res.status(400).json({
                success: false,
                message: "At least one field (username or email) is required",
            });
        }

        // Check if user exists
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Validate email if provided
        if (email && !validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        const updateUsername = username || user.username;
        const updateEmail = email || user.email;

        const query = `
      UPDATE users
      SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, username, email, role, avatar_url, created_at, updated_at
    `;

        const { rows } = await pool.query(query, [
            updateUsername,
            updateEmail,
            userId,
        ]);

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: rows[0],
        });
    } catch (err) {
        console.error("Update profile error:", err);
        if (err.code === "23505") {
            // Unique violation
            return res.status(409).json({
                success: false,
                message: "Username or email already in use",
            });
        }
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const userId = req.user.id;

        const uploadStream = () =>
            new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "avatars",
                        resource_type: "auto",
                        width: 200,
                        height: 200,
                        crop: "fill",
                    },
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    },
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });

        const result = await uploadStream();

        const query = `
      UPDATE users
      SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, username, email, avatar_url, updated_at
    `;

        const { rows } = await pool.query(query, [result.secure_url, userId]);

        res.json({
            success: true,
            message: "Avatar uploaded successfully",
            url: result.secure_url,
            user: rows[0],
        });
    } catch (err) {
        console.error("Upload avatar error:", err);
        res.status(500).json({
            success: false,
            message: "Error uploading avatar",
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
};

// Delete user (only admin or self)
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: paramId } = req.params;

        // Check authorization
        if (parseInt(userId) !== parseInt(paramId)) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own account",
            });
        }

        const query =
            "DELETE FROM users WHERE id = $1 RETURNING id, username, email";
        const { rows } = await pool.query(query, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully",
            user: rows[0],
        });
    } catch (err) {
        console.error("Delete user error:", err);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
};

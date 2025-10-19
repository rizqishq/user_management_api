import { pool } from "../config/db.js";

// Get user by email
export const getUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
    ]);
    return result.rows[0];
};

// Get user by ID
export const getUserById = async (id) => {
    const result = await pool.query(
        "SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users WHERE id = $1",
        [id],
    );
    return result.rows[0];
};

// Get all users (public data only)
export const getAllUsers = async () => {
    const result = await pool.query(
        "SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users",
    );
    return result.rows;
};

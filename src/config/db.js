import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DB_URL,
});

async function connectDB() {
    try {
        await pool.connect();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

export { pool, connectDB };

// src/config/db.js
import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql2.createPool({
  host: process.env.DB_HOST || "sql12.freesqldatabase.com",
  user: process.env.DB_USER || "sql12801496",
  password: process.env.DB_PASS || "1U1d9rpkJk",
  database: process.env.DB_NAME || "sql12801496",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully.");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
  }
};

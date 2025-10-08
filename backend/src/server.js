// src/server.js
import express from "express";
import cors from "cors";
import { testConnection } from "./config/db.js";
import helloRouter from "./routes/helloRoute.js";
import noteRouter from "./routes/notesRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", helloRouter);
app.use("/notes", noteRouter);

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  testConnection();
});

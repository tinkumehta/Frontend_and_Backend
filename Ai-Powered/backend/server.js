import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("DevConnect API is running");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));

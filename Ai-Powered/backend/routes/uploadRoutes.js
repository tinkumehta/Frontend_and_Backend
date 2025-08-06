import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Single image upload
router.post("/", protect, upload.single("image"), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

export default router;

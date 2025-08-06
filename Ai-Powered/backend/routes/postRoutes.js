import express from "express";
import {
  createPost,
  getFeedPosts,
  toggleLikePost,
  addComment,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createPost).get(protect, getFeedPosts);
router.put("/:id/like", protect, toggleLikePost);
router.post("/:id/comment", protect, addComment);

export default router;

import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Create Post
export const createPost = asyncHandler(async (req, res) => {
  const { content, image } = req.body;
  const post = await Post.create({
    user: req.user._id,
    content,
    image,
  });
  res.status(201).json(post);
});

// Get All Posts (Feed)
export const getFeedPosts = asyncHandler(async (req, res) => {
  const currentUser = req.user;

  const user = await User.findById(currentUser._id);
  const followingIds = [...user.following, currentUser._id]; // include self

  const posts = await Post.find({ user: { $in: followingIds } })
    .populate("user", "username profilePicture")
    .populate("comments.user", "username profilePicture")
    .sort({ createdAt: -1 });

  res.json(posts);
});


// Like/Unlike Post
export const toggleLikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const index = post.likes.indexOf(req.user._id);
  if (index !== -1) {
    post.likes.splice(index, 1); // Unlike
  } else {
    post.likes.push(req.user._id); // Like
  }

  await post.save();
  res.json({ likes: post.likes.length });
});

// Add Comment
export const addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comment = {
    user: req.user._id,
    text: req.body.text,
  };

  post.comments.push(comment);
  await post.save();
  res.status(201).json(post.comments);
});


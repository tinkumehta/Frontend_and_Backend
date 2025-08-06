import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// @route   POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const newUser = await User.create({ username, email, password });

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    token: generateToken(newUser._id),
  });
});

// @route   POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id),
  });
});


export const getMyProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  res.json(user);
});

// @route   PUT /api/users/me
export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @route   GET /api/users/:userId
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const followUser = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user._id;

  if (currentUserId.toString() === targetUserId) {
    res.status(400);
    throw new Error("You cannot follow yourself");
  }

  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser || !currentUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Already following?
  if (currentUser.following.includes(targetUserId)) {
    res.status(400);
    throw new Error("Already following");
  }

  currentUser.following.push(targetUserId);
  targetUser.followers.push(currentUserId);

  await currentUser.save();
  await targetUser.save();

  res.json({ message: "Followed successfully" });
});

// Unfollow a user
export const unfollowUser = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user._id;

  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser || !currentUser) {
    res.status(404);
    throw new Error("User not found");
  }

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUserId
  );
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUserId.toString()
  );

  await currentUser.save();
  await targetUser.save();

  res.json({ message: "Unfollowed successfully" });
});

// Get followers/following list
export const getFollowersFollowing = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("followers", "username profilePicture")
    .populate("following", "username profilePicture");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    followers: user.followers,
    following: user.following,
  });
});

// @route   GET /api/users/search?query=badal
export const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.query;

  if (!query) {
    res.status(400);
    throw new Error("Search query is missing");
  }

  const users = await User.find({
    username: { $regex: query, $options: "i" },
  }).select("username profilePicture bio");

  res.json(users);
});

// @route   GET /api/users/suggested
export const getSuggestedUsers = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);

  const exclude = [...currentUser.following, currentUser._id];

  const suggestions = await User.find({
    _id: { $nin: exclude },
  })
    .select("username profilePicture bio")
    .limit(5); // return top 5 suggestions

  res.json(suggestions);
});



import express from "express";
import { 
    registerUser, loginUser,
     getMyProfile, updateMyProfile,
     getUserById,followUser, unfollowUser,
     getFollowersFollowing , searchUsers,
    getSuggestedUsers
     } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me",protect, getMyProfile );
router.get("/:useraId",protect, getUserById );
router.put("/me", protect, updateMyProfile);

router.put("/:id/follow", protect, followUser);
router.put("/:id/unfollow", protect, unfollowUser);
router.get("/:id/follows", getFollowersFollowing);


router.get("/search", searchUsers);
router.get("/suggested", protect, getSuggestedUsers);


export default router;

import { useState } from "react";
import { toggleFollow } from "../services/auth";

export default function FollowButton({ userId, isFollowing, onToggle }) {
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      await toggleFollow(userId);
      onToggle(); // callback to parent
    } catch (err) {
      console.error("Follow toggle error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-3 py-1 rounded text-white ${isFollowing ? "bg-red-500" : "bg-blue-500"}`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

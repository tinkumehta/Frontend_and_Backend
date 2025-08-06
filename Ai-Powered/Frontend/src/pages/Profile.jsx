import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../services/auth";
import PostItem from "../components/PostItem";
import FollowButton from "../components/FollowButton";

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile(username);
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const toggleFollowUI = () => {
    setProfile((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followersCount: prev.isFollowing
        ? prev.followersCount - 1
        : prev.followersCount + 1,
    }));
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <div className="flex justify-between items-center bg-white p-4 rounded shadow">
        <div>
          <h2 className="text-2xl font-bold">@{profile.user.username}</h2>
          <p className="text-gray-600">{profile.user.bio || "No bio yet."}</p>
          <div className="mt-1 text-sm text-gray-500">
            👥 {profile.followersCount} followers | 👤 {profile.followingCount} following
          </div>
        </div>
        <FollowButton
          userId={profile.user._id}
          isFollowing={profile.isFollowing}
          onToggle={toggleFollowUI}
        />
      </div>

      <h3 className="mt-6 mb-2 text-xl font-semibold">Posts</h3>
      {profile.posts.map((post) => (
        <PostItem key={post._id} post={post} onLike={() => {}} onComment={() => {}} />
      ))}
    </div>
  );
}

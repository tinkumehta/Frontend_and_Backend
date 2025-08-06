import { useEffect, useState } from "react";
import { getFeedPosts } from "../services/auth";
import CreatePost from "../components/CreatePost";
import PostItem from "../components/PostItem";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  const fetchFeed = async () => {
    try {
      const data = await getFeedPosts();
      setPosts(data);
    } catch (err) {
      console.error("Error loading feed", err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likes: p.likedByMe ? p.likes.slice(1) : [...p.likes, "temp"],
            }
          : p
      )
    );
  };

  const handleComment = (postId, comment) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, comments: [...p.comments, comment] }
          : p
      )
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <CreatePost onPostCreated={handleNewPost} />
      {posts.map((post) => (
        <PostItem
          key={post._id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
        />
      ))}
    </div>
  );
}

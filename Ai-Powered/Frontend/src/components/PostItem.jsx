import { useState } from "react";
import { toggleLike, addComment } from "../services/auth";

export default function PostItem({ post, onLike, onComment }) {
  const [commentText, setCommentText] = useState("");

  const handleLike = async () => {
    try {
      await toggleLike(post._id);
      onLike(post._id);
    } catch (err) {
      console.error("Error liking post", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const newComment = await addComment(post._id, commentText);
      onComment(post._id, newComment);
      setCommentText("");
    } catch (err) {
      console.error("Error commenting", err);
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded mb-4">
      <div className="font-semibold">{post.author.username}</div>
      <p className="my-2">{post.content}</p>

      <div className="text-sm text-gray-600 mb-2">
        ❤️ {post.likes.length} | 💬 {post.comments.length}
      </div>

      <button onClick={handleLike} className="text-blue-600 mr-4">
        {post.likedByMe ? "Unlike" : "Like"}
      </button>

      <form onSubmit={handleComment} className="mt-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add comment"
          className="border p-1 rounded w-full"
        />
      </form>

      <ul className="mt-2 text-sm text-gray-700">
        {post.comments.slice(0, 2).map((c) => (
          <li key={c._id}><strong>{c.author.username}</strong>: {c.text}</li>
        ))}
      </ul>
    </div>
  );
}

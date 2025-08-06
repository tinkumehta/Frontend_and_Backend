import { useState } from "react";
import { createPost } from "../services/auth";

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const newPost = await createPost(content);
      onPostCreated(newPost); // callback to parent
      setContent("");
    } catch (err) {
      console.error("Error creating post", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening in dev world?"
        className="w-full p-2 border rounded resize-none"
        rows={3}
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
        Post
      </button>
    </form>
  );
}

import axios from "axios";
import React, { useState } from "react";

function Review({ id }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [isRecommended, setIsRecommended] = useState(false);

  const handle = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `/api/reviews/${id}`,
        { rating, comment, isRecommended },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
      alert("Review added successfully ✅");
      setRating("");
      setComment("");
      setIsRecommended(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add review ❌");
    }
  };

  return (
    <div>
      <form onSubmit={handle} className="space-y-3">
        <input
          type="number"
          placeholder="Enter rating (1-5)"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          type="text"
          placeholder="Enter your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isRecommended}
            onChange={(e) => setIsRecommended(e.target.checked)}
          />
          Recommend this product?
        </label>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-300 shadow-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Review;

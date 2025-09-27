import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";


export default function ProductDetail() {
  const { id } = useParams(); // ✅ productId from route
  const {user, token} = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isRecommended, setIsRecommended] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch product data
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/reviews/${id}`);
      console.log(data);
      
      setProduct(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // ✅ Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) return alert("Please fill all fields");

    try {
      setSubmitting(true);
      await axios.post(
        `/api/products/${id}/reviews`,
        { rating, comment, isRecommended },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh product after adding review
      setRating(0);
      setComment("");
      setIsRecommended(false);
      fetchProduct();
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Product Details */}
      <div className="border p-4 rounded-lg shadow">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-full rounded-lg"
        />
        <h1 className="text-2xl font-bold mt-2">{product.name}</h1>
        <p className="text-gray-700">{product.description}</p>
        <p className="text-xl font-semibold mt-2">₹{product.price}</p>
        <p className="text-sm text-gray-500">
          {product.numofReviews} Reviews | ⭐ {product.ratings?.toFixed(1) || 0}
        </p>
      </div>

      {/* Reviews Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Customer Reviews</h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-3">
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="p-3 border rounded-lg shadow-sm bg-gray-50"
              >
                <p className="font-semibold">
                  {review.user?.name || "Anonymous"} ⭐ {review.rating}
                </p>
                <p>{review.comment}</p>
                {review.isRecommended && (
                  <p className="text-green-600 text-sm">✔ Recommended</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {/* Review Form */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 p-4 border rounded-lg shadow bg-white"
        >
          <h3 className="text-lg font-semibold mb-3">Write a Review</h3>

          <label className="block mb-2">
            Rating:
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="block w-full p-2 border rounded"
            >
              <option value="">Select...</option>
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val} ⭐
                </option>
              ))}
            </select>
          </label>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded p-2 mt-2"
          />

          <label className="flex items-center mt-2 gap-2">
            <input
              type="checkbox"
              checked={isRecommended}
              onChange={(e) => setIsRecommended(e.target.checked)}
            />
            I recommend this product
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-gray-600">
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>{" "}
          to write a review.
        </p>
      )}
    </div>
  );
}

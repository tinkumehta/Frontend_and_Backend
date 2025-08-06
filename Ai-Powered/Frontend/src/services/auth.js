import api from "./api";

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const getFeedPosts = async () => {
  const res = await api.get("/posts");
  return res.data.posts;
};

export const createPost = async (content) => {
  const res = await api.post("/posts", { content });
  return res.data.post;
};

export const toggleLike = async (postId) => {
  const res = await api.put(`/posts/${postId}/like`);
  return res.data;
};

export const addComment = async (postId, text) => {
  const res = await api.post(`/posts/${postId}/comment`, { text });
  return res.data.comment;
};

export const getUserProfile = async (username) => {
  const res = await api.get(`/auth/${username}`);
  return res.data;
};

export const toggleFollow = async (userId) => {
  const res = await api.put(`/auth/${userId}/follow`);
  return res.data;
};
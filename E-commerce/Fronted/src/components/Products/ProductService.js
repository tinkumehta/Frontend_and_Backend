// src/services/productService.js
import axios from "axios";

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await axios.get(`/api/products?${query}`);
  return res.data;
};

export const fetchProduct = async (id) => {
  const res = await axios.get(`/api/products/${id}`);
  return res.data;
};

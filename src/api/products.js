// src/api/products.js
import API from "./axios";

export const fetchProducts = async () => {
  const { data } = await API.get("api/products");
  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await API.get(`api/products/${id}`);
  return data;
};

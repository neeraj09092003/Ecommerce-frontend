// src/api/cart.js
import API from "./axios";

export const addToCart = async (productId, quantity = 1) => {
  const { data } = await API.post("/cart", {
    productId,
    quantity,
  });
  return data;
};

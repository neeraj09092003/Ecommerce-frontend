// api/cart.js
import axios from "axios";

export const addToCart = async (productId, quantity) => {
  const token = localStorage.getItem("token");
  return await axios.post(
    "/cart",
    { productId, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

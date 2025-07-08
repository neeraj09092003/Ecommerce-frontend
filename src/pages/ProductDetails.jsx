// pages/ProductDetails.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../api/products";
import { addToCart } from "../api/cart";
import { toast } from "react-toastify";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product)
    return <div className="p-6 text-red-500">Product not found.</div>;

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <img
        src={product.image}
        alt={product.name}
        className="w-full md:w-1/3 h-auto object-cover rounded"
      />

      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="text-xl text-green-700 font-bold mb-2">
          ₹{product.price}
        </p>
        <p className="text-sm mb-2">Category: {product.category}</p>
        <p className="text-sm mb-4">In Stock: {product.stock}</p>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={async () => {
            try {
              setAdding(true);
              await addToCart(product._id, 1);
              toast.success("🛒 Product added to cart successfully!");
            } catch (err) {
              toast.error("❌ Failed to add to cart");
              console.error(err);
            } finally {
              setAdding(false);
            }
          }}
          disabled={!isLoggedIn || adding}
        >
          {!isLoggedIn
            ? "Login to Add to Cart"
            : adding
            ? "Adding..."
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;

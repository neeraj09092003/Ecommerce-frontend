import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://ecommerce-backend-291k.onrender.com/api/cart",
        { productId: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart.");
    }
  };

  return (
    <div className="border rounded shadow-sm hover:shadow-md transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-500 text-sm mb-1">{product.category}</p>
        <p className="font-bold text-lg text-blue-600">₹{product.price}</p>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => navigate(`/product/${product._id}`)}
            className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            View
          </button>
          <button
            onClick={handleAddToCart}
            className="text-sm px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

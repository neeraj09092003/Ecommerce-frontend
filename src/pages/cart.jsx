import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [updatingQty, setUpdatingQty] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  // Handle quantity change locally and update backend
  const handleQuantityChange = async (productId, delta) => {
    if (updatingQty) return;
    setUpdatingQty(true);

    const updatedItems = cart.items.map((item) => {
      if (item.product._id === productId) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    });

    const updatedItem = updatedItems.find(
      (item) => item.product._id === productId
    );

    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId,
          quantity: updatedItem.quantity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart({ ...cart, items: updatedItems });
    } catch (err) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingQty(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart({
        ...cart,
        items: cart.items.filter((item) => item.product._id !== productId),
      });
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  // Calculate total
  const calculateTotal = () =>
    cart?.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

  // Place order using checkout form data
  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          shippingInfo: shipping,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Order placed successfully!");
      setCart({ items: [] });
      navigate("/orders");
    } catch (err) {
      toast.error("❌ Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="p-4">Loading your cart...</div>;
  if (!cart || cart.items.length === 0)
    return <div className="p-4 text-gray-500">Your cart is empty.</div>;

 // ...existing code...
return (
  <div className="p-2 sm:p-4 md:p-6 max-w-3xl mx-auto">
    <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">
      🛒 Your Cart
    </h1>
    <div className="space-y-4">
      {cart.items.map((item) => (
        <div
          key={item.product._id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-2 gap-4"
        >
          <div className="flex flex-row sm:flex-row items-center gap-4 w-full">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-semibold text-base sm:text-lg">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                ₹{item.product.price} × {item.quantity} ={" "}
                <span className="font-bold">
                  ₹{item.product.price * item.quantity}
                </span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() =>
                    handleQuantityChange(item.product._id, -1)
                  }
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() =>
                    handleQuantityChange(item.product._id, 1)
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => removeFromCart(item.product._id)}
            className="bg-red-500 text-white px-3 py-1 rounded w-full sm:w-auto mt-2 sm:mt-0"
          >
            Remove
          </button>
        </div>
      ))}
    </div>

    <div className="mt-6 text-right text-xl font-semibold">
      Total: ₹{calculateTotal()}
    </div>

    {/* Checkout Form */}
    {!showCheckout ? (
      <button
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        onClick={() => setShowCheckout(true)}
      >
        Place Order
      </button>
    ) : (
      <form
        className="mt-6 space-y-4 bg-gray-50 p-4 rounded"
        onSubmit={async (e) => {
          e.preventDefault();
          await placeOrder();
        }}
      >
        <div>
          <label className="block mb-1">Address</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={shipping.address}
            onChange={e => setShipping({ ...shipping, address: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-1">City</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={shipping.city}
            onChange={e => setShipping({ ...shipping, city: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Pincode</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={shipping.pincode}
            onChange={e => setShipping({ ...shipping, pincode: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={shipping.phone}
            onChange={e => setShipping({ ...shipping, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Payment Method</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
          >
            <option value="CashOnDelivery">Cash on Delivery</option>
            <option value="Online">Online</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={placingOrder}
        >
          {placingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    )}
  </div>
);
// ...existing code...
};

export default Cart;
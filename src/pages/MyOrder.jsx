import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://ecommerce-backend-291k.onrender.com/api/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div className="p-4">Loading your orders...</div>;

  return (
    <div className="p-2 sm:p-4 overflow-x-auto">
      <h1 className="text-lg sm:text-2xl font-bold mb-4">🧾 My Orders</h1>
      <table className="min-w-[700px] w-full border border-gray-300 text-xs sm:text-base">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-2 sm:px-4 border">Order ID</th>
            <th className="py-2 px-2 sm:px-4 border">Items</th>
            <th className="py-2 px-2 sm:px-4 border">Amount</th>
            <th className="py-2 px-2 sm:px-4 border">Status</th>
            <th className="py-2 px-2 sm:px-4 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-2">{order._id}</td>
                <td className="p-2">
                  {order.items.map((item, idx) => (
                    <div key={item.product?._id || idx}>
                      {item.product ? (
                        <>
                          {item.product.name} x {item.quantity}
                        </>
                      ) : (
                        <span className="text-red-500">
                          [Product deleted] x {item.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                </td>
                <td className="p-2">
                  ₹
                  {order.items.reduce(
                    (sum, i) =>
                      sum + (i.product && i.product.price ? i.product.price * i.quantity : 0),
                    0
                  )}
                </td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;
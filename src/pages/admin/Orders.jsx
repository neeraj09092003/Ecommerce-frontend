import { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://ecommerce-backend-291k.onrender.com/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      alert("❌ Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `https://ecommerce-backend-291k.onrender.com/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // refresh
    } catch (err) {
      alert("❌ Failed to update status");
    }
  };

  if (loading) return <div className="p-4">Loading orders...</div>;

  return (
    <div className="p-2 sm:p-4 overflow-x-auto">
      <h1 className="text-lg sm:text-2xl font-bold mb-4">📦 Admin - Orders</h1>
      <table className="min-w-[700px] w-full border border-gray-300 text-xs sm:text-base">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-2 sm:px-4 border">User</th>
            <th className="py-2 px-2 sm:px-4 border">Items</th>
            <th className="py-2 px-2 sm:px-4 border">Amount</th>
            <th className="py-2 px-2 sm:px-4 border">Status</th>
            <th className="py-2 px-2 sm:px-4 border">Action</th>
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
                <td className="p-2">
                  {order.user?.name || "N/A"}
                  <br />
                  <span className="text-xs text-gray-500">
                    {order.user?.email}
                  </span>
                </td>
                <td className="p-2">
                  {order.items.map((i, idx) => (
                    <div key={i.product?._id || idx}>
                      {i.product ? (
                        <>
                          {i.product.name} x {i.quantity}
                        </>
                      ) : (
                        <span className="text-red-500">
                          [Product deleted] x {i.quantity}
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
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  >
                    <option>Pending</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
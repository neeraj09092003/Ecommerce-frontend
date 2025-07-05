import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      alert("❌ Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (!stats) return <div className="p-4 text-red-500">Failed to load stats</div>;

  // Prepare chart data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueData = stats.monthlyRevenue
    ? stats.monthlyRevenue.map((revenue, i) => ({ month: months[i], revenue }))
    : [];

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">📊 Admin Dashboard</h1>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Products" value={stats.totalProducts} color="bg-blue-500" />
        <StatCard label="Orders" value={stats.totalOrders} color="bg-green-500" />
        <StatCard label="Revenue" value={`₹${stats.totalRevenue}`} color="bg-yellow-500" />
        {"totalUsers" in stats && (
          <StatCard label="Users" value={stats.totalUsers} color="bg-purple-500" />
        )}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart: Monthly Revenue */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2 text-center">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={v => `₹${v}`} />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Pie Chart: Product Category Distribution */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2 text-center">Product Categories</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.categoryDistribution}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stats.categoryDistribution.map((entry, idx) => (
                  <Cell key={entry.category} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className={`p-4 text-white rounded shadow ${color}`}>
    <p className="text-lg sm:text-xl font-semibold">{label}</p>
    <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
  </div>
);

export default Dashboard;
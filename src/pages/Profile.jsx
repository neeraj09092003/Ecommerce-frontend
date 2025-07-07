import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://ecommercebackend-grx8.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ name: res.data.user.name, email: res.data.user.email });
      } catch (err) {
        toast.error("❌ Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">👤 My Profile</h1>
      <div className="space-y-4 bg-white p-4 sm:p-6 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <div className="w-full border rounded px-3 py-2 bg-gray-100 break-words">{user.name}</div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <div className="w-full border rounded px-3 py-2 bg-gray-100 break-words">{user.email}</div>
        </div>
        <button
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
          onClick={() => navigate("/orders")}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default Profile;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { useAuth } from "../context/AuthContext"; // <-- import useAuth
import { jwtDecode } from "jwt-decode"; // <-- import jwtDecode
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { setUser, setToken } = useAuth(); // <-- get setters from context
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://ecommerce-backend-291k.onrender.com/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      // 👇 Update context immediately
      setToken(res.data.token);
      setUser(jwtDecode(res.data.token));

      toast.success("✅ Logged in successfully!");
      navigate("/"); // You can redirect to /admin if admin
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-2">
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full max-w-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
        Login to Your Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-md hover:bg-indigo-700 transition"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-4">
        New user?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  </div>
);
}

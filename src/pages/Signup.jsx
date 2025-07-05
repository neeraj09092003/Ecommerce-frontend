import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://ecommerce-backend-291k.onrender.com/api/auth/register",
        form
      );

      //Get token from response
      const { token } = res.data;

      // ✅ Save token in localStorage
      localStorage.setItem("token", token);

      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 p-2">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full max-w-sm space-y-4"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2">
        Sign Up
      </h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow-md transition-all"
      >
        Register
      </button>

      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </form>
  </div>
);
};

export default Signup;

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL //  backend URL
});
// Add token to every request if user is logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

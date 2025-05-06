import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify"; // assuming you have react-toastify installed
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/chat"; // remember last page or default to /chat

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent full page reload
    if (!form.username || !form.password ) {
      setError( "Something went wrong");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/login", {
        username: form.username,
        password: form.password, // send plaintext; hash on server
      });

      login(res.data.access_token, form.username);
      toast.success("Login successful! 🚀");
      navigate(from, { replace: true }); // navigate to remembered page
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials!";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className="p-6 max-w-md mx-auto animate-fadeIn">
      <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back 👋</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="p-3 border rounded focus:outline-none focus:ring focus:border-purple-400"
          placeholder="Username or Email"
          autoComplete="username"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="p-3 border rounded focus:outline-none focus:ring focus:border-purple-400"
          placeholder="Password"
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default Login;

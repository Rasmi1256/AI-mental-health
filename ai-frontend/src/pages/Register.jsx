import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/register", {
        username: form.username,
        password_hash: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input name="username" onChange={handleChange} className="mb-2 w-full p-2" placeholder="Username" />
      <input name="password" type="password" onChange={handleChange} className="mb-2 w-full p-2" placeholder="Password" />
      <button onClick={handleSubmit} className="bg-purple-600 text-white py-2 px-4 rounded">Register</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default Register;

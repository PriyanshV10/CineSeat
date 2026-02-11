import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", formData);
      login(response.data.token);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Email might be taken.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-10 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 hover:shadow-violet-500/10">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-slate-800 dark:text-white">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-200"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-200"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-200"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-[0.98] duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Signup;

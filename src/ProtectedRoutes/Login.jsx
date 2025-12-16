import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authcontext";
import { useTheme } from "@/hooks/use-theme";
import { backendUrl } from "./api";

const LoginPage = () => {
  const [usercode, setUsercode] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usercode, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed.");
        return;
      }

      if (data.secretKey) {
        login(data);
        toast.success(data.message || "Login successful!");
        navigate("/");
      } else {
        toast.error("Login failed: Authentication key missing.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Server error. Please try again later.");
    }
  };
  const backgroundClass =
    theme === "dark"
      ? "bg-gray-900 bg-cover bg-center"
      : "bg-gray-100 bg-cover bg-center";

  const cardBgClass =
    theme === "dark"
      ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white"
      : "bg-white shadow-lg border border-gray-300 text-gray-900";

  const inputBgClass =
    theme === "dark"
      ? "bg-gray-800 bg-opacity-70 placeholder-gray-400 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
      : "bg-white placeholder-gray-500 text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500";

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${backgroundClass}`}
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1666891827442-136490fc4140?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=768')",
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative w-full max-w-sm p-8 space-y-8 rounded-xl ${cardBgClass}`}
      >
        <h2
          className={`text-center text-3xl font-dm font-bold tracking-tight ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome to the Admin Portal
        </h2>
        <p
          className={`text-center font-dm text-sm ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Please sign in to continue.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <label className="sr-only font-dm">Username / Usercode</label>
            <input
              type="text"
              required
              className={`relative font-dm block w-full appearance-none rounded-md border px-3 py-3 sm:text-sm focus:z-10 focus:outline-none focus:ring-1 ${inputBgClass}`}
              placeholder="Usercode / Username"
              value={usercode}
              onChange={(e) => setUsercode(e.target.value)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <label className="sr-only">Password</label>
            <input
              type="password"
              required
              className={`relative font-dm block w-full appearance-none rounded-md border px-3 py-3 sm:text-sm focus:z-10 focus:outline-none focus:ring-1 ${inputBgClass}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative font-dm w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-200"
          >
            Sign in
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;

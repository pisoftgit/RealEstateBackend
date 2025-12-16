import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const UserForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    mobile: "",
    password: "",
    gender: "male",
    dob: "",
    motherName: "",
    email: "",
    userName: "",
    active: "yes",
    // --- NEW STATE FIELD ---
    userCategory1: "Normal User", // Default category
  });

  // Example list of categories for the dropdown
  const categories = [
    "Normal User",
    "Admin",
    "Manager",
    "Support Staff",
    "Realtor"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      name: "",
      fatherName: "",
      mobile: "",
      password: "",
      gender: "male",
      dob: "",
      motherName: "",
      email: "",
      userName: "",
      active: "yes",
      // Reset category to default
      userCategory1: "Normal User",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.mobile,
      password: formData.password,
      // --- UPDATED PAYLOAD FIELD ---
      userCategory1: formData.userCategory1, // Use state value
      usercode: formData.userName,
      dob: formData.dob,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      gender: formData.gender,
      // Ensure 'active' status aligns with backend expectations (assuming 'Yes'/'No' on backend)
      active: formData.active.toLowerCase() === 'yes' ? 'Yes' : 'No', 
    };

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Auth token missing");

      const res = await axios.post(`${backendUrl}/user/add`, payload, {
        headers: { secret_key: token },
      });

      if (res?.data?.success || res?.status === 200) {
        alert("User Added/Updated Successfully!");
        handleReset();
      } else {
        alert("Failed: " + (res?.data?.message || "Unknown Error"));
      }

      console.log("API Response:", res.data);
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the user.");
    } finally {
      setLoading(false);
    }
  };
  
  const inputClass = "w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white";

  return (
    <motion.div
      className="min-h-screen p-5 font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto mb-10">
        <motion.h1
          className="text-xl md:text-4xl font-bold text-blue-950 dark:text-white select-none"
          variants={itemVariants}
        >
          Add / Update User
        </motion.h1>
      </div>

      <motion.div
        className="max-w-4xl mx-auto p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT SIDE */}
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Father Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Enter father's name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Mobile</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Gender</label>
              <div className="flex gap-6">
                {["male", "female", "n/a"].map((g) => (
                  <label key={g} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <input 
                        type="radio" 
                        name="gender" 
                        value={g} 
                        checked={formData.gender === g} 
                        onChange={handleChange} 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">
            {/* --- NEW FIELD: User Category --- */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">User Category</label>
              <select
                name="userCategory1"
                value={formData.userCategory1}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
              </select>
            </div>
            {/* --------------------------------- */}
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">DOB</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Mother Name</label>
              <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Enter mother's name" className={inputClass} />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" className={inputClass} />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">User ID</label>
              <input type="text" name="userName" value={formData.userName} onChange={handleChange} placeholder="Enter username" className={inputClass} />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Active Status</label>
              <div className="flex gap-6">
                {["yes", "no"].map((v) => (
                  <label key={v} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <input 
                        type="radio" 
                        name="active" 
                        value={v} 
                        checked={formData.active === v} 
                        onChange={handleChange} 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t mt-4 border-gray-200 dark:border-gray-700">
            <button type="button" onClick={handleReset} className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              Reset
            </button>

            <motion.button 
                type="submit" 
                disabled={loading} 
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700 shadow-lg disabled:opacity-50 transition" 
                whileTap={{ scale: 0.98 }}
            >
              {loading ? "Saving..." : "Submit"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UserForm;
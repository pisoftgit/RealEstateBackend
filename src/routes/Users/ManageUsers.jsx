import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
// Assuming the path is correct
import { backendUrl } from "../../ProtectedRoutes/api";
import { FiEdit2, FiTrash2, FiEye, FiX } from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

// --- Simple Modal Component ---
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-4xl w-full relative h-[80vh] overflow-y-auto" // Increased size and added scroll
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX size={24} />
        </button>
        {children}
      </motion.div>
    </div>
  );
};

// --- UPDATED: Update User Form Component ---
const UpdateUserForm = ({ user, token, backendUrl, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  
  // Example list of categories for the dropdown
  const categories = [
    "Normal User",
    "Admin",
    "Manager",
    "Support Staff",
    "Realtor"
  ];

  // Map API data keys to form state keys
  const [formData, setFormData] = useState({
    id: user.id || null,
    name: user.name || "",
    fatherName: user.fatherName || "",
    mobile: user.phone || "", // userForm uses 'mobile', API data uses 'phone'
    password: user.password || "",
    gender: user.gender || "male",
    dob: user.dob || "",
    motherName: user.motherName || "",
    email: user.email || "",
    userName: user.usercode || "", // userForm uses 'userName', API data uses 'usercode'
    active: user.active?.toLowerCase() === 'no' ? 'no' : 'yes',
    // --- NEW/UPDATED STATE FIELD ---
    userCategory1: user.userCategory1 || "Normal User", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Construct the payload for the update API
    const payload = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      phone: formData.mobile, // Use mobile from form state
      password: formData.password, 
      userCategory1: formData.userCategory1, // Use updated category
      usercode: formData.userName, // Use userName from form state
      dob: formData.dob,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      gender: formData.gender,
      active: formData.active.toLowerCase() === 'yes' ? 'Yes' : 'No', 
    };

    try {
      const res = await axios.post(`${backendUrl}/user/add`, payload, {
        headers: { secret_key: token },
      });

      if (res?.data?.success || res?.status === 200) {
        alert(`User ${user.usercode} updated successfully!`);
        onSuccess(); // Re-fetch data for table refresh
        onClose(); // Close the modal
      } else {
        alert("Update Failed: " + (res?.data?.message || "Unknown Error"));
      }

    } catch (error) {
      console.error("Update Error:", error);
      alert("An error occurred while updating the user.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all";

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-blue-950 dark:text-white border-b pb-2">
        Edit User: {user.usercode}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter full name" className={inputClass} />
          </div>

          {/* Father Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Father Name</label>
            <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter father's name" className={inputClass} />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Mobile</label>
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter mobile number" className={inputClass} />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Password</label>
            <input type="password" name="password" 
              // Clear the input to prevent sending a possibly hashed value back by mistake
              value={''} 
              onChange={handleChange} 
              placeholder="Leave blank to keep existing password" 
              className={inputClass} 
            />
            <p className="text-xs text-red-500 mt-1">Leave blank unless you want to change it.</p>
          </div>
          
           {/* Gender */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Gender</label>
            <div className="flex gap-6 mt-2 text-gray-700 dark:text-gray-300">
              {["male", "female", "n/a"].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-5">
          
          {/* User Name / User Code (Disabled) */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">User Name (ID)</label>
            <input type="text" name="userName" value={formData.userName} onChange={handleChange} placeholder="User ID" className={`${inputClass} bg-gray-200 dark:bg-gray-700/80 cursor-not-allowed`} disabled />
          </div>

          {/* --- NEW FIELD: User Category --- */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">User Category</label>
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
          
          {/* DOB */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">DOB</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} />
          </div>

          {/* Mother Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Mother Name</label>
            <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Enter mother's name" className={inputClass} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" className={inputClass} />
          </div>
          
          {/* Active Status */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Active Status</label>
            <div className="flex gap-6 mt-2 text-gray-700 dark:text-gray-300">
              {["yes", "no"].map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="active" value={v} checked={formData.active === v} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 transition">
          Cancel
        </button>

        <motion.button 
          type="submit" 
          disabled={loading} 
          className="px-6 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition disabled:opacity-50" 
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Updating..." : "Save Changes"}
        </motion.button>
      </div>
    </motion.form>
  );
};
// -------------------------------------------------------------


export default function UserSearchManage() {
  const [searchBy, setSearchBy] = useState("id");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const token = localStorage.getItem("authToken");

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/user/manage`, {
        headers: { secret_key: token },
      });
      if (res?.data) {
        setUsers(res.data);
        setFilteredUsers(res.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users on search (No change)
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (!val.trim()) {
      setFilteredUsers(users);
      return;
    }

    if (searchBy === "id") {
      setFilteredUsers(
        users.filter((u) =>
          u.usercode?.toLowerCase().includes(val.toLowerCase())
        )
      );
    } else if (searchBy === "name") {
      setFilteredUsers(
        users.filter((u) => (u.name || "").toLowerCase().includes(val.toLowerCase()))
      );
    }
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
    setSearchTerm("");
    setFilteredUsers(users);
  };

  // --- UPDATED onEdit function to use the full form ---
  const onEdit = (user) => {
    setModalContent(
      <UpdateUserForm
        user={user}
        token={token}
        backendUrl={backendUrl}
        onSuccess={fetchUsers} // Re-fetch the list on successful update
        onClose={() => setModalOpen(false)} // Function to close the modal
      />
    );
    setModalOpen(true);
  };
  // ---------------------------------------------------

  // onDelete (No change)
  const onDelete = (user) => {
    setModalContent(
      <div>
        <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
        <p>Are you sure you want to delete <b>{user.usercode}</b>?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700 transition"
            onClick={async () => {
              try {
                const res = await axios.delete(`${backendUrl}/user/delete/${user.id}`, {
                  headers: { secret_key: token },
                });
                if (res?.data?.success) {
                  alert("User deleted successfully!");
                  fetchUsers();
                } else {
                  alert("Failed to delete user.");
                }
              } catch (error) {
                console.error(error);
                alert("Error deleting user.");
              } finally {
                setModalOpen(false);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
    setModalOpen(true);
  };

  // onView (Slightly improved formatting)
  const onView = (user) => {
    setModalContent(
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-950 dark:text-white border-b pb-2">View User Details</h2>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p><strong>User ID:</strong> <span className="font-mono text-blue-600 dark:text-blue-300">{user.usercode}</span></p>
          <p><strong>Name:</strong> {user.name || "-"}</p>
          <p><strong>Father Name:</strong> {user.fatherName || "-"}</p>
          <p><strong>Mother Name:</strong> {user.motherName || "-"}</p>
          <p><strong>Category:</strong> {user.userCategory1 || "-"}</p>
          <p><strong>DOB:</strong> {user.dob || "-"}</p>
          <p><strong>Gender:</strong> {user.gender || "-"}</p>
          <p><strong>Contact:</strong> {user.phone || "-"}</p>
          <p><strong>Email:</strong> {user.email || "-"}</p>
          <p><strong>Password Hash:</strong> <span className="font-mono text-sm break-all select-all">{user.password}</span></p>
          <p><strong>Active:</strong> 
            <span className={`ml-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${user.active === "Yes" || !user.active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`}>
              {user.active || "Yes"}
            </span>
          </p>
        </div>
      </div>
    );
    setModalOpen(true);
  };

  return (
    <motion.div
      className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Title Section */}
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white mb-8 select-none max-w-6xl mx-auto"
        variants={itemVariants}
      >
        Search & Manage Users
      </motion.h1>

      {/* Search/Filter Card */}
      <motion.div
        className="mb-8 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-6xl mx-auto"
        variants={itemVariants}
      >
        <h2 className="text-xl font-bold mb-4 text-blue-950 dark:text-white border-b pb-2">
          Search Parameters
        </h2>

        <div className="space-y-4">
          <fieldset className="flex items-center gap-8 text-lg font-semibold text-gray-700 dark:text-gray-300">
            <legend className="sr-only">Search By</legend>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="searchBy"
                value="id"
                checked={searchBy === "id"}
                onChange={handleSearchByChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              By ID
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="searchBy"
                value="name"
                checked={searchBy === "name"}
                onChange={handleSearchByChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              By Name
            </label>
          </fieldset>

          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="searchTerm">
            Enter User {searchBy === "id" ? "ID" : "Name"}
          </label>
          <input
            id="searchTerm"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={`Search user by ${searchBy === "id" ? "ID" : "Name"}...`}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </motion.div>

      {/* Results Table */}
      <motion.div
        className="overflow-x-auto max-w-6xl mx-auto rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700"
        variants={itemVariants}
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-950 text-white select-none">
            <tr>
              <th className="px-4 py-3 border border-blue-900 font-semibold text-sm whitespace-nowrap">Sr No</th>
              <th className="px-4 py-3 border border-blue-900 font-semibold text-sm whitespace-nowrap">User ID</th>
              <th className="px-4 py-3 border border-blue-900 font-semibold text-sm whitespace-nowrap">Category</th>
              <th className="px-4 py-3 border border-blue-900 font-semibold text-sm whitespace-nowrap">Name</th>
              <th className="px-4 py-3 border border-blue-900 font-semibold text-sm whitespace-nowrap">Password</th>
              <th className="px-4 py-3 border border-blue-900 font-semibold text-sm whitespace-nowrap">Contact</th>
              <th className="px-4 py-3 border border-blue-900 font-semibold text-sm whitespace-nowrap">Active</th>
              <th className="px-4 py-3 border border-blue-900 font-semibold text-sm whitespace-nowrap">Assign</th>
              <th className="px-4 py-3 border border-blue-900 font-semibold text-sm whitespace-nowrap">Manage</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  {loading ? "Loading..." : "No users found matching your search."}
                </td>
              </tr>
            )}

            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={`border-b border-gray-200 dark:border-gray-700 ${
                  index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700/50" : "bg-white dark:bg-gray-800"
                } hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300`}
              >
                <td className="px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-700">{index + 1}</td>
                <td className="px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-700 font-medium text-blue-800 dark:text-blue-300">{user.usercode}</td>
                <td className="px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-700">{user.userCategory1}</td>
                <td className="px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-700 font-medium">{user.name || "-"}</td>
                <td className="px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-700 font-mono overflow-hidden max-w-[150px] truncate">{user.password}</td>
                <td className="px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-700 whitespace-nowrap">{user.phone || "-"}</td>
                <td className="px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-700">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${user.active === "Yes" || !user.active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`}>
                    {user.active || "Yes"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-700">{/* Empty for Assign */}</td>
                <td className="px-4 py-3 text-sm space-x-2 whitespace-nowrap flex items-center gap-2">
                  <FiEdit2 className="text-blue-600 cursor-pointer hover:text-blue-800" size={18} onClick={() => onEdit(user)} />
                  <FiTrash2 className="text-red-600 cursor-pointer hover:text-red-800" size={18} onClick={() => onDelete(user)} />
                  <FiEye className="text-gray-600 cursor-pointer hover:text-gray-800" size={18} onClick={() => onView(user)} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {modalContent}
      </Modal>
    </motion.div>
  );
}
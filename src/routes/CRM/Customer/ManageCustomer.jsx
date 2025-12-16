import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiUsers, FiSun, FiMoon } from "react-icons/fi";

// Variants imported from the reference IPAddressManager component
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const CustomerManagement = () => {
  // Theme state from reference code (toggle logic is not implemented here but the state is included)
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([
    { id: 1, code: "01035214000001", name: "Thor", mobile: "7876761256", gender: "Male", entryDate: "", address: "India, Himachal Pradesh, Solan" },
    { id: 2, code: "01035214000002", name: "Rette", mobile: "3424324344", gender: "Male", entryDate: "11-04-2025", address: "India, Chandigarh, Chandigarh" },
    { id: 3, code: "01035214000003", name: "Jaii", mobile: "6655767656", gender: "Male", entryDate: "11-04-2025", address: "India, Bihar, Araria" },
    { id: 4, code: "01035214000004", name: "Mark", mobile: "3243242343", gender: "Male", entryDate: "11-04-2025", address: "India, Bihar, Araria" },
    { id: 5, code: "01035214000005", name: "Dj", mobile: "2123821321", gender: "Male", entryDate: "11-04-2025", address: "India, Chandigarh, Chandigarh" },
    { id: 6, code: "01035214000007", name: "Carry", mobile: "4543543543", gender: "Male", entryDate: "11-04-2025", address: "India, Chandigarh, Chandigarh" },
    { id: 7, code: "01035214000008", name: "Today Attendance refsdafsd", mobile: "7876761254", gender: "Male", entryDate: "", address: "India, Rajasthan, Dhaulpur" },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleView = (customer) => setSelectedCustomer(customer);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  const filteredCustomers = customers.filter((c) =>
    [c.name, c.code, c.mobile, c.address]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
  // Theme toggle function (copied from reference for complete state)
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  // Variant for table rows (new, based on itemVariants)
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="min-h-screen p-5 font-sans relative bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto mb-8">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white select-none flex items-center"
          variants={itemVariants}
        >
          <FiUsers className="mr-3 text-blue-600 dark:text-blue-400" /> Customer Management
        </motion.h1>
        {/* Theme Toggle Button from reference code */}
        <motion.button
          onClick={toggleTheme}
          className="p-3 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
          variants={itemVariants}
          whileTap={{ scale: 0.9 }}
        >
          {isDark ? <FiSun size={24} /> : <FiMoon size={24} />}
        </motion.button>
      </div>

      <motion.div
        className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        
        {/* 🔍 Search Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="col-span-2 flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-3 bg-gray-50 dark:bg-gray-700">
            <FiSearch className="text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by Name, Code, Mobile, or Address"
              className="w-full bg-transparent text-sm p-2 focus:outline-none text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 🧾 Customer Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse table-auto">
            <thead className="bg-blue-950 text-white text-xs uppercase rounded-lg">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">S/N</th>
                <th className="px-4 py-3">User Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Entry Date</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3 text-center rounded-tr-lg">Manage</th>
              </tr>
            </thead>
            <motion.tbody 
              className="text-gray-700 dark:text-gray-300"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <AnimatePresence>
                {filteredCustomers.map((c, index) => (
                  <motion.tr
                    key={c.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">{c.code}</td>
                    <td className="px-4 py-3">{c.name}</td>
                    <td className="px-4 py-3">{c.mobile}</td>
                    <td className="px-4 py-3">{c.gender}</td>
                    <td className="px-4 py-3">{c.entryDate || "--"}</td>
                    <td className="px-4 py-3">{c.address}</td>
                    <td className="px-4 py-3 text-center space-x-3">
                      <motion.button
                        onClick={() => handleView(c)}
                        className="p-1 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                        title="View"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FiEye size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => alert(`Edit customer: ${c.name}`)}
                        className="p-1 rounded-full text-green-600 hover:bg-green-100 dark:hover:bg-gray-700 transition-colors"
                        title="Edit"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FiEdit2 size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(c.id)}
                        className="p-1 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 transition-colors"
                        title="Delete"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FiTrash2 size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>

        {/* 👁️ View Modal */}
        <AnimatePresence>
          {selectedCustomer && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-blue-600 dark:border-blue-400"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <h3 className="text-xl font-bold mb-5 text-blue-950 dark:text-white border-b pb-2 flex items-center">
                  <FiEye className="mr-2 text-blue-600 dark:text-blue-400" /> Customer Details
                </h3>
                <div className="space-y-3 text-sm text-gray-800 dark:text-gray-200">
                  <p><strong>Name:</strong> {selectedCustomer.name}</p>
                  <p><strong>Customer Code:</strong> <span className="font-mono text-blue-600 dark:text-blue-400">{selectedCustomer.code}</span></p>
                  <p><strong>Mobile:</strong> {selectedCustomer.mobile}</p>
                  <p><strong>Gender:</strong> {selectedCustomer.gender}</p>
                  <p><strong>Entry Date:</strong> {selectedCustomer.entryDate || "—"}</p>
                  <p><strong>Address:</strong> {selectedCustomer.address}</p>
                </div>
                <div className="flex justify-end mt-6">
                  <motion.button
                    onClick={() => setSelectedCustomer(null)}
                    className="px-6 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CustomerManagement;
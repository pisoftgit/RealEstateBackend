import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiPlus, FiEdit, FiTrash2, FiWifi, FiGlobe } from "react-icons/fi";

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

const IPAddressManager = () => {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  
  const [newIp, setNewIp] = useState("");
  const [newWifiName, setNewWifiName] = useState("");

  const [ipAddresses, setIpAddresses] = useState([
    { id: 1, ip: "178.156.136.86", wifiName: "Airtel_prit_7288" },
    { id: 2, ip: "124.253.208.70", wifiName: "Pisoft_connect 5G" },
    { id: 3, ip: "61.247.227.234", wifiName: "TP-Link_960E_5G" },
    { id: 4, ip: "0:0:0:0:0:0:0:1", wifiName: "LocalHost" },
    { id: 5, ip: "192.168.6.210", wifiName: "Remote Wifi" },
  ]);

  const handleAddIP = (e) => {
    e.preventDefault();
    if (!newIp || !newWifiName) return;

    const newEntry = {
      id: Date.now(), 
      ip: newIp,
      wifiName: newWifiName,
    };

    setIpAddresses([newEntry, ...ipAddresses]);
    setNewIp("");
    setNewWifiName("");
  };

  const handleUpdateIP = (id) => {
    const oldIp = ipAddresses.find(ip => ip.id === id)?.ip || "";
    const updatedIp = prompt("Enter new IP address:", oldIp);
    if (updatedIp) {
      setIpAddresses(ipAddresses.map(ip => ip.id === id ? { ...ip, ip: updatedIp } : ip));
    }
  };

  const handleDeleteIP = (id) => {
    if (window.confirm("Are you sure you want to delete this IP address?")) {
      setIpAddresses(ipAddresses.filter(ip => ip.id !== id));
    }
  };

  const IpAddressCard = ({ id, ip, wifiName, onEdit, onDelete }) => (
    <motion.div
      className="flex justify-between items-center p-4 rounded-xl shadow-md border-2 border-dashed border-blue-600 dark:border-blue-400
        bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
      variants={itemVariants}
      whileHover={{ scale: 1.01, boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex flex-col">
        <div className="flex items-center text-lg font-semibold text-blue-950 dark:text-white">
          <FiGlobe className="mr-2 text-blue-600 dark:text-blue-400" />
          {ip}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
          <FiWifi className="mr-1 w-4 h-4" />
          {wifiName}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Edit IP"
        >
          <FiEdit size={18} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Delete IP"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen p-5 font-sans relative bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-10">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white select-none" 
          variants={itemVariants}
        >
          IP Whitelist Manager
        </motion.h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="lg:col-span-1 p-2 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Whitelist Entry
          </h2>

          <form onSubmit={handleAddIP} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                <FiGlobe className="inline mr-1 text-blue-600" /> IP Address
              </label>
              <input
                type="text"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                placeholder="e.g., 192.168.1.1"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                <FiWifi className="inline mr-1 text-blue-600" /> Wi-Fi Name (Optional)
              </label>
              <input
                type="text"
                value={newWifiName}
                onChange={(e) => setNewWifiName(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                placeholder="e.g., Pisoft_Office_LAN"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setNewIp(""); setNewWifiName(""); }}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700 transition-colors shadow-lg"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> Add Entry
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.div
          className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Whitelisted Addresses ({ipAddresses.length})
          </h2>

          {ipAddresses.length > 0 ? (
            <motion.div className="space-y-3" variants={containerVariants}>
              <AnimatePresence>
                {ipAddresses.map((ip) => (
                  <IpAddressCard
                    key={ip.id}
                    id={ip.id}
                    ip={ip.ip}
                    wifiName={ip.wifiName}
                    onEdit={() => handleUpdateIP(ip.id)}
                    onDelete={() => handleDeleteIP(ip.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.p 
              className="text-center py-10 text-gray-500 dark:text-gray-400"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              No whitelisted IP addresses found. Add a new one using the form on the left.
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IPAddressManager;
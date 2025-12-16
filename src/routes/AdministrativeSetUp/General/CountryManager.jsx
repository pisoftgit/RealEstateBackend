import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiGlobe } from "react-icons/fi";
import useCountry from "../../../hooks/General/useCountry"; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const CountryManager = () => {
  const { countries, loading, error, addCountry, updateCountry, deleteCountry } = useCountry();
  
  const [newCountry, setNewCountry] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingCode, setEditingCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle adding new country
  const handleAddCountry = (e) => {
    e.preventDefault();
    if (!newCountry.trim() || !newCountryCode.trim()) return;
    addCountry(newCountry.trim(), newCountryCode.trim());
    setNewCountry("");
    setNewCountryCode("");
  };

  // Handle updating country
  const handleUpdateCountry = (e) => {
    e.preventDefault();
    if (!editingName.trim() || !editingCode.trim()) return;
    updateCountry(editingId, editingName.trim(), editingCode.trim());
    setIsModalOpen(false); // Close modal
  };

  // Handle delete country
  const handleDeleteCountry = (id) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      deleteCountry(id);
    }
  };

  // Open the edit modal with country data
  const openEditModal = (country) => {
    setEditingId(country.id);
    setEditingName(country.country);
    setEditingCode(country.countryCode);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setEditingName("");
    setEditingCode("");
  };

  return (
    <motion.div
      className="min-h-screen p-5 font-dm bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white mb-10 ml-4" variants={itemVariants}>
        Country Manager
      </motion.h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form to Add New Country */}
        <motion.div className="p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Country
          </h2>
          
          <form onSubmit={handleAddCountry} className="space-y-5">
            <div>
              <label className="text-gray-700 dark:text-gray-300 font-medium">Country Name</label>
              <input
                type="text"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                placeholder="e.g. India"
                className="w-full p-3 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 dark:text-gray-300 font-medium">Country Code</label>
              <input
                type="text"
                value={newCountryCode}
                onChange={(e) => setNewCountryCode(e.target.value)}
                placeholder="e.g. +91"
                className="w-full p-3 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={() => { setNewCountry(""); setNewCountryCode(""); }} className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700">
                Reset
              </button>
              <button type="submit" className="flex items-center px-4 py-2 rounded-lg bg-blue-950 text-white">
                <FiPlus className="mr-1" />
                Submit
              </button>
            </div>
          </form>
        </motion.div>

        {/* Country List */}
        <motion.div className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border"
          initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-blue-950 dark:text-white">
            Existing Countries ({countries.length})
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600 dark:text-red-400 py-10">{error}</p>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {countries.map((country) => (
                  <motion.div
                    key={country.id}
                    className="flex justify-between items-center p-4 rounded-xl shadow-md border-2 border-blue-600 bg-white dark:bg-gray-800"
                    variants={itemVariants}
                  >
                    <div>
                      <div className="flex items-center text-lg font-semibold">
                        <FiGlobe className="mr-2 text-blue-600" />
                        {country.country}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{country.countryCode}</div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(country)} className="p-2 rounded-full text-blue-600">
                        <FiEdit size={18} />
                      </button>

                      <button onClick={() => handleDeleteCountry(country.id)} className="p-2 rounded-full text-red-600">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* Update Country Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-blue-950 dark:text-white mb-4">Update Country</h2>
            
            <form onSubmit={handleUpdateCountry}>
              <div className="mb-4">
                <label className="text-gray-700 dark:text-gray-300 font-medium">Country Name</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full p-3 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="text-gray-700 dark:text-gray-300 font-medium">Country Code</label>
                <input
                  type="text"
                  value={editingCode}
                  onChange={(e) => setEditingCode(e.target.value)}
                  className="w-full p-3 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" className="flex items-center px-4 py-2 rounded-lg bg-blue-950 text-white">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CountryManager;

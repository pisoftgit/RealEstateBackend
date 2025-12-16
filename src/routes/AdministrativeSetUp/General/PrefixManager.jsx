import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import usePrefix from "../../../hooks/General/usePrefix";

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

const PrefixManager = () => {
  const [newPrefix, setNewPrefix] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrefix, setEditingPrefix] = useState(null);
  const { prefixes, loading, error, addPrefix, updatePrefix, deletePrefix } = usePrefix();

  const handleAddPrefix = (e) => {
    e.preventDefault();
    if (newPrefix.trim()) {
      addPrefix(newPrefix.trim());
      setNewPrefix("");
    }
  };

  const handleOpenModal = (prefix) => {
    setEditingPrefix(prefix);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPrefix(null);
  };

  const handleUpdatePrefix = (e) => {
    e.preventDefault();
    const updatedPrefix = editingPrefix.prefixName.trim();
    if (updatedPrefix) {
      updatePrefix(editingPrefix.id, updatedPrefix);
      handleCloseModal();
    }
  };

  const handleDeletePrefix = (id) => {
    if (window.confirm("Are you sure you want to delete this prefix?")) {
      deletePrefix(id);
    }
  };

  const PrefixCard = ({ id, prefixName, onEdit, onDelete }) => (
    <motion.div
      className="flex justify-between font-dm items-center p-4 rounded-xl shadow-md border-2 border-dashed border-blue-950 dark:border-gray-400
        bg-white dark:bg-gray-800 dark:hover:bg-gray-700 transition-all cursor-pointer"
      variants={itemVariants}
      whileHover={{ scale: 1.01, boxShadow: "0 6px 12px rgba(0,0,0,0.1)" }}
    >
      <div className="text-lg font-semibold text-blue-950 dark:text-gray-200">
        {prefixName}
      </div>
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiEdit size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen p-5 font-dm font-sans relative bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex font-dm justify-between items-center max-w-6xl mx-auto mb-10">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white select-none"
          variants={itemVariants}
        >
          Prefix Manager
        </motion.h1>
      </div>

      <div className="max-w-6xl font-dm mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Prefix */}
        <motion.div
          className="lg:col-span-1 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-dm font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Prefix
          </h2>

          <form onSubmit={handleAddPrefix} className="space-y-5">
            <div>
              <label className="block font-dm text-gray-700 dark:text-gray-300 font-medium mb-2">
                Prefix Name
              </label>
              <input
                type="text"
                value={newPrefix}
                onChange={(e) => setNewPrefix(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-950 dark:focus:ring-gray-400 focus:border-transparent transition-all"
                placeholder="e.g., Mr."
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setNewPrefix("")}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700 transition-colors shadow-lg"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> Add Prefix
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Existing Prefixes */}
        <motion.div
          className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Prefixes ({prefixes.length})
          </h2>

          {prefixes.length > 0 ? (
            <motion.div className="space-y-3" variants={containerVariants}>
              <AnimatePresence>
                {prefixes.map((prefix) => (
                  <PrefixCard
                    key={prefix.id}
                    id={prefix.id}
                    prefixName={prefix.prefixName}
                    onEdit={() => handleOpenModal(prefix)}
                    onDelete={() => handleDeletePrefix(prefix.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No prefixes available</p>
          )}
        </motion.div>
      </div>

      {/* Modal for Updating Prefix */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-96"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Update Prefix</h3>
              <form onSubmit={handleUpdatePrefix}>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    New Prefix Name
                  </label>
                  <input
                    type="text"
                    value={editingPrefix?.prefixName || ""}
                    onChange={(e) =>
                      setEditingPrefix({
                        ...editingPrefix,
                        prefixName: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-950 dark:focus:ring-gray-400 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700 transition-colors shadow-lg"
                    whileTap={{ scale: 0.98 }}
                  >
                    Update
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PrefixManager;

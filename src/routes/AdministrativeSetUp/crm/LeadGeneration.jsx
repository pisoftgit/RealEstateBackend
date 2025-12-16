import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiUsers } from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const LeadSourceManager = () => {
  const [leadFrom, setLeadFrom] = useState("");
  const [description, setDescription] = useState("");
  const [sources, setSources] = useState([
    { id: 1, name: "Walk-In", description: "Leads generated through direct walk-ins." },
  ]);

  const handleAddSource = (e) => {
    e.preventDefault();
    if (!leadFrom.trim()) return;
    const newEntry = {
      id: Date.now(),
      name: leadFrom.trim(),
      description: description.trim() || "N/A",
    };
    setSources([newEntry, ...sources]);
    setLeadFrom("");
    setDescription("");
  };

  const handleEdit = (id) => {
    const src = sources.find((s) => s.id === id);
    const newName = prompt("Edit Lead Source:", src.name);
    const newDesc = prompt("Edit Description:", src.description);
    if (newName) {
      setSources(
        sources.map((s) =>
          s.id === id
            ? { ...s, name: newName.trim(), description: newDesc?.trim() || "N/A" }
            : s
        )
      );
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lead source?")) {
      setSources(sources.filter((s) => s.id !== id));
    }
  };

  const LeadSourceCard = ({ id, name, description, index }) => (
    <motion.div
      className="flex justify-between items-center p-4 rounded-xl shadow-md border-2 border-dashed border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
    >
      <div>
        <div className="flex items-center text-lg font-semibold text-blue-950 dark:text-blue-300">
          <span className="mr-3 text-gray-500 text-sm">#{index + 1}</span>
          <FiUsers className="mr-2 text-blue-600 dark:text-blue-400" />
          {name}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
          {description || "N/A"}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(id)}
          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 transition"
        >
          <FiEdit size={18} />
        </button>
        <button
          onClick={() => handleDelete(id)}
          className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 transition"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen p-5 font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1 className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white mb-10">
        Configure Lead Generation Source
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <motion.div
          className="lg:col-span-1 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Lead Source
          </h2>

          <form onSubmit={handleAddSource} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Lead From <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={leadFrom}
                onChange={(e) => setLeadFrom(e.target.value)}
                placeholder="e.g., Walk-In, Referral, Online Ad"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter short description..."
                rows="3"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setLeadFrom("");
                  setDescription("");
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
              >
                Reset
              </button>

              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700 transition-colors shadow-lg"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> Add Lead Source
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Existing Sources */}
        <motion.div
          className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Lead Generation Sources ({sources.length})
          </h2>

          <AnimatePresence>
            {sources.length > 0 ? (
              <motion.div className="space-y-3" variants={containerVariants}>
                {sources.map((src, index) => (
                  <LeadSourceCard
                    key={src.id}
                    id={src.id}
                    name={src.name}
                    description={src.description}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.p
                className="text-center py-10 text-gray-500 dark:text-gray-400"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                No lead sources found. Add one using the form on the left.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeadSourceManager;

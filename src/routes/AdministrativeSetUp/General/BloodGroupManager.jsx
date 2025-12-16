import React, { useState, useEffect } from "react";
import useBloodGroupActions from "../../../hooks/General/useBloodGroup"; // Adjust path as needed
import { FiEdit, FiTrash2, FiPlus, FiDroplet } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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

const BloodGroupManager = () => {
  const { bloodGroups, loading, addBloodGroup, updateBloodGroup, deleteBloodGroup } = useBloodGroupActions();
  const [newBloodGroup, setNewBloodGroup] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [updatedBloodGroup, setUpdatedBloodGroup] = useState("");

  useEffect(() => {
    if (editingId !== null) {
      const bloodGroupToEdit = bloodGroups.find((bg) => bg.id === editingId);
      setUpdatedBloodGroup(bloodGroupToEdit?.bloodGroup || "");
    }
  }, [editingId, bloodGroups]);

  const handleAddBloodGroup = async (e) => {
    e.preventDefault();
    if (newBloodGroup) {
      await addBloodGroup(newBloodGroup);
      setNewBloodGroup("");
    }
  };

  const handleUpdateBloodGroup = async (e) => {
    e.preventDefault();
    if (updatedBloodGroup && editingId !== null) {
      await updateBloodGroup(editingId, updatedBloodGroup);
      setEditingId(null); // Reset the edit mode
      setUpdatedBloodGroup(""); // Clear the update input
    }
  };

  const handleEditBloodGroup = (id) => {
    setEditingId(id);
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors duration-500 font-dm"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white mb-10 ml-4"
        variants={itemVariants}
      >
        Blood Group Manager
      </motion.h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Blood Group Form */}
        <motion.div
          className="lg:col-span-1 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            {editingId ? "Update Blood Group" : "Add New Blood Group"}
          </h2>

          <form
            onSubmit={editingId ? handleUpdateBloodGroup : handleAddBloodGroup}
            className="space-y-5"
          >
            <div>
              <label className="text-gray-700 dark:text-gray-300 font-medium">Blood Group</label>
              <input
                type="text"
                value={editingId ? updatedBloodGroup : newBloodGroup}
                onChange={(e) =>
                  editingId ? setUpdatedBloodGroup(e.target.value) : setNewBloodGroup(e.target.value)
                }
                placeholder="e.g. A+, B-"
                className="w-full p-3 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="submit"
                className="flex items-center px-4 py-2 rounded-lg bg-blue-950 text-white"
              >
                <FiPlus className="mr-1" />
                {editingId ? "Update Blood Group" : "Add Blood Group"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Existing Blood Groups */}
        <motion.div
          className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-blue-950 dark:text-white">
            Existing Blood Groups
          </h2>

          {loading ? (
            <div className="text-center text-lg">Loading...</div>
          ) : (
            <AnimatePresence>
              {bloodGroups.map((bg) => (
                <motion.div
                  key={bg.id}
                  className="flex justify-between items-center p-4 mb-4 rounded-xl shadow-md border-2 border-blue-600 bg-white dark:bg-gray-800"
                  variants={itemVariants}
                >

                  <div className="flex items-center text-lg font-semibold text-blue-950 dark:text-gray-200">
                   <FiDroplet className="mr-2 text-red-500 dark:text-gray-200" /> {bg.bloodGroup}</div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditBloodGroup(bg.id)}
                      className="p-2 rounded-full text-blue-600"
                    >
                      <FiEdit size={18} />
                    </button>

                    <button
                      onClick={() => deleteBloodGroup(bg.id)}
                      className="p-2 rounded-full text-red-600"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BloodGroupManager;

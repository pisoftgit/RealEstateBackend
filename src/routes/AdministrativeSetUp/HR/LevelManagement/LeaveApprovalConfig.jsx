import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import useLeaveApprovalConfigActions from "../../../../hooks/HR/LeaveConfig/useLeaveApproval"

const LeaveApprovalConfig = () => {
  const [levelName, setLevelName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const {
    configs: levelNames,
    loading,
    fetchConfigs,
    saveOrUpdateConfig,
    deleteConfig,
  } = useLeaveApprovalConfigActions();

  // Reset form
  const resetForm = () => {
    setLevelName("");
    setEditingId(null);
  };

  // Add or update level
  const handleAddOrUpdateLevel = async (e) => {
    e.preventDefault();
    if (!levelName.trim()) return;

    try {
      await saveOrUpdateConfig({
        id: editingId,
        levelName: levelName.trim(),
      });
      resetForm();
    } catch (err) {
      console.error("Failed to save/update level:", err);
    }
  };

  // Edit a level
  const handleEdit = (id) => {
    const level = levelNames.find((l) => l.id === id);
    if (!level) return;
    setLevelName(level.levelName);
    setEditingId(id);
  };

  // Delete a level
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Level Name?")) return;

    try {
      await deleteConfig(id);
    } catch (err) {
      console.error("Failed to delete level:", err);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 font-dm bg-gray-50 dark:bg-gray-900 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10">
        Hierarchy Level Name Setup
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Form */}
        <motion.div className="p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            {editingId ? "Edit Level Name" : "Add New Level Name"}
          </h2>
          <form onSubmit={handleAddOrUpdateLevel} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Level Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={levelName}
                onChange={(e) => setLevelName(e.target.value)}
                placeholder="Enter Level Name (e.g., Senior Management, Team Lead)"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
              >
                Reset
              </button>
              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> {editingId ? "Update Level Name" : "Add Level Name"}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Existing Level Names Table */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Level Names ({levelNames.length})
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">Loading...</p>
          ) : (
            <AnimatePresence>
              {levelNames.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-gray-900 dark:text-white rounded-lg overflow-hidden min-w-[400px]">
                    <thead>
                      <tr className="bg-blue-950 text-white dark:bg-gray-700">
                        <th className="p-3 text-left text-sm font-semibold border-b border-gray-200 dark:border-gray-600 w-16">Sr No</th>
                        <th className="p-3 text-left text-sm font-semibold border-b border-gray-200 dark:border-gray-600">Level Name</th>
                        <th className="p-3 text-center text-sm font-semibold border-b border-gray-200 dark:border-gray-600 w-24">Manage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence initial={false}>
                        {levelNames.map((l, i) => (
                          <motion.tr
                            key={l.id}
                            className={`border-b border-gray-200 dark:border-gray-700 ${
                              i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
                            } hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <td className="p-3 text-sm">{i + 1}</td>
                            <td className="p-3 text-sm font-medium text-blue-800 dark:text-blue-300">{l.levelName}</td>
                            <td className="p-3 text-center text-sm">
                              <motion.button
                                onClick={() => handleEdit(l.id)}
                                title="Edit"
                                className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full mr-2"
                                whileTap={{ scale: 0.8 }}
                              >
                                <FiEdit size={16} />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(l.id)}
                                title="Delete"
                                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full"
                                whileTap={{ scale: 0.8 }}
                              >
                                <FiTrash2 size={16} />
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No hierarchy level names added yet.
                </p>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeaveApprovalConfig;

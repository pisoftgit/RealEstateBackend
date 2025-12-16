import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit, FiCheck, FiX } from "react-icons/fi";
import useFurnishingStatuses from "../../../hooks/propertyConfig/useFurnishingStatus";

const ConfigureFurnishingStatus = () => {
  const { statuses, loading, addStatus, updateStatus, deleteStatus } = useFurnishingStatuses();
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const resetForm = () => setStatus("");

  const handleAddStatus = async (e) => {
    e.preventDefault();
    if (!status.trim()) return;

    const newName = status.trim();
    const exists = statuses.some((s) => s.status.toLowerCase() === newName.toLowerCase());
    if (exists) return alert(`The furnishing status '${newName}' already exists.`);

    try {
      await addStatus({ status: newName });
      resetForm();
    } catch (err) {
      alert("Failed to add furnishing status");
    }
  };

  const startEditing = (id, currentStatus) => {
    setEditingId(id);
    setEditingValue(currentStatus);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const saveEditing = async (id) => {
    if (!editingValue.trim()) return;
    const newName = editingValue.trim();

    const exists = statuses.some(
      (s) => s.status.toLowerCase() === newName.toLowerCase() && s.id !== id
    );
    if (exists) return alert(`The furnishing status '${newName}' already exists.`);

    try {
      await updateStatus({ id, status: newName });
      cancelEditing();
    } catch (err) {
      alert("Failed to update furnishing status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this furnishing status?")) return;
    try {
      await deleteStatus(id);
    } catch (err) {
      alert("Failed to delete furnishing status");
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10 ml-4">
        Furnishing Status Configuration
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Add Form */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Furnishing Status
          </h2>

          <form onSubmit={handleAddStatus} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                Status Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="e.g., Fully Furnished, Semi Furnished"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium rounded-lg 
                           text-gray-600 bg-gray-200 hover:bg-gray-300 
                           dark:bg-gray-700 dark:text-gray-300 transition"
              >
                Reset
              </button>

              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg
                           bg-blue-950 text-white hover:bg-blue-700"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> Add Status
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Table */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Furnishing Statuses ({statuses.length})
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading...</p>
          ) : statuses.length === 0 ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              No furnishing statuses found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-gray-900 dark:text-white rounded-lg overflow-hidden min-w-[500px]">
                <thead>
                  <tr className="bg-blue-950 text-white dark:bg-gray-700">
                    <th className="p-3 text-left text-sm font-semibold">Sr No</th>
                    <th className="p-3 text-left text-sm font-semibold">Status Name</th>
                    <th className="p-3 text-center text-sm font-semibold w-20">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence initial={false}>
                    {statuses.map((s, idx) => (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`border-b dark:border-gray-700 ${
                          idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
                        }`}
                      >
                        <td className="p-3 text-sm">{idx + 1}</td>
                        <td className="p-3 text-sm font-medium text-blue-800 dark:text-blue-300">
                          {editingId === s.id ? (
                            <input
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
                            />
                          ) : (
                            s.status
                          )}
                        </td>
                        <td className="p-3 text-center flex justify-center gap-2">
                          {editingId === s.id ? (
                            <>
                              <motion.button
                                onClick={() => saveEditing(s.id)}
                                className="p-1 text-green-600 hover:bg-green-100 rounded-full"
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiCheck size={16} />
                              </motion.button>
                              <motion.button
                                onClick={cancelEditing}
                                className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiX size={16} />
                              </motion.button>
                            </>
                          ) : (
                            <>
                              <motion.button
                                onClick={() => startEditing(s.id, s.status)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiEdit size={16} />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(s.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiTrash2 size={16} />
                              </motion.button>
                            </>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConfigureFurnishingStatus;

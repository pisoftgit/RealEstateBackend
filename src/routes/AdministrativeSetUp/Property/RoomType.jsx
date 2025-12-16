import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit, FiCheck, FiX } from "react-icons/fi";

import useRoomTypes from "../../../hooks/propertyConfig/useRoomType";

const ConfigureRoomType = () => {
  const {
    roomTypes,
    loading,
    addRoomType,
    updateRoomType,
    fetchRoomTypes,
  } = useRoomTypes();

  const [newRoomType, setNewRoomType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const resetForm = () => {
    setNewRoomType("");
    setEditingId(null);
    setEditingName("");
  };

  // ADD
  const handleAddRoomType = async (e) => {
    e.preventDefault();
    const name = newRoomType.trim();
    if (!name) return;

    // prevent duplicates
    if (roomTypes.some(rt => rt.type.toUpperCase() === name.toUpperCase())) {
      alert(`Room type '${name}' already exists.`);
      return;
    }

    try {
      await addRoomType({ type: name });
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Unable to add room type");
    }
  };

  // UPDATE
  const handleUpdateRoomType = async (id) => {
    const name = editingName.trim();
    if (!name) return;

    // prevent duplicates
    if (roomTypes.some(rt => rt.type.toUpperCase() === name.toUpperCase() && rt.id !== id)) {
      alert(`Room type '${name}' already exists.`);
      return;
    }

    try {
      await updateRoomType({ id, type: name });
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Unable to update room type");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room type?")) return;

    try {
      // You do not have deleteRoomType in hook, so backend must be updated later
      // For now just refresh
      await fetchRoomTypes();
    } catch (err) {
      console.error(err);
      alert("Unable to delete room type");
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10 ml-4">
        Room Type Configuration
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* ADD NEW FORM */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Room Type
          </h2>

          <form onSubmit={handleAddRoomType} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                Room Type Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={newRoomType}
                onChange={(e) => setNewRoomType(e.target.value)}
                placeholder="e.g., Balcony, Utility Room"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 transition"
              >
                Reset
              </button>

              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> Add Room Type
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* TABLE */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Room Types ({roomTypes.length})
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              Loading room types...
            </p>
          ) : roomTypes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-gray-900 dark:text-white rounded-lg overflow-hidden min-w-[500px]">
                <thead>
                  <tr className="bg-blue-950 text-white dark:bg-gray-700">
                    <th className="p-3 text-left text-sm font-semibold w-16">Sr No</th>
                    <th className="p-3 text-left text-sm font-semibold">Room Type Name</th>
                    <th className="p-3 text-center text-sm font-semibold w-28">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence initial={false}>
                    {roomTypes.map((item, idx) => (
                      <motion.tr
                        key={item.id}
                        className={`border-b border-gray-200 dark:border-gray-700 ${
                          idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
                        } hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="p-3 text-sm">{idx + 1}</td>

                        <td className="p-3 text-sm font-medium text-blue-800 dark:text-blue-300">
                          {editingId === item.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                            />
                          ) : (
                            item.type
                          )}
                        </td>

                        <td className="p-3 text-center flex justify-center gap-2">
                          {editingId === item.id ? (
                            <>
                              <motion.button
                                onClick={() => handleUpdateRoomType(item.id)}
                                className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-gray-600 rounded-full"
                                whileTap={{ scale: 0.8 }}
                                title="Save"
                              >
                                <FiCheck size={16} />
                              </motion.button>

                              <motion.button
                                onClick={resetForm}
                                className="p-1 text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                                whileTap={{ scale: 0.8 }}
                                title="Cancel"
                              >
                                <FiX size={16} />
                              </motion.button>
                            </>
                          ) : (
                            <>
                              <motion.button
                                onClick={() => {
                                  setEditingId(item.id);
                                  setEditingName(item.type);
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full"
                                whileTap={{ scale: 0.8 }}
                                title="Edit"
                              >
                                <FiEdit size={16} />
                              </motion.button>

                              <motion.button
                                onClick={() => handleDelete(item.id)}
                                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full"
                                whileTap={{ scale: 0.8 }}
                                title="Delete"
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
          ) : (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              No room types found.
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConfigureRoomType;

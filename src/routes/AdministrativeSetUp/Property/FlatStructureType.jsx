import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit, FiCheck, FiX } from "react-icons/fi";
import useFlatHouseStructureTypes from "../../../hooks/propertyConfig/useFlatHouseStructureType";

const ConfigureFlatHouseStructure = () => {
  const { types, loading, addType, updateType, deleteType } =
    useFlatHouseStructureTypes();

  const [newStructure, setNewStructure] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const resetForm = () => setNewStructure("");

  // Add structure
  const handleAddStructure = async (e) => {
    e.preventDefault();
    const trimmed = newStructure.trim();
    if (!trimmed) return;

    const exists = types.some((t) => t.structureType === trimmed);
    if (exists) {
      alert(`The structure '${trimmed}' already exists.`);
      return;
    }

    try {
      await addType({ structureType: trimmed });
      resetForm();
    } catch (err) {
      console.error("Failed to add structure:", err);
    }
  };

  // Delete structure
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this structure?")) return;
    try {
      await deleteType(id);
    } catch (err) {
      console.error("Failed to delete structure:", err);
    }
  };

  // Start editing
  const startEditing = (id, value) => {
    setEditingId(id);
    setEditingValue(value);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingValue("");
  };

  // Save editing
  const saveEditing = async (id) => {
    const trimmed = editingValue.trim();
    if (!trimmed) return;

    const exists = types.some(
      (t) => t.structureType === trimmed && t.id !== id
    );
    if (exists) {
      alert(`The structure '${trimmed}' already exists.`);
      return;
    }

    try {
      await updateType({ id, structureType: trimmed });
      cancelEditing();
    } catch (err) {
      console.error("Failed to update structure:", err);
    }
  };

  useEffect(()=>{
    console.log(types)
  })

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10 ml-4">
        Structure Configuration
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Add Structure Form */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Flat/House Structure
          </h2>
          <form onSubmit={handleAddStructure} className="space-y-5">
            <div className="grid grid-row-2 gap-1">
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                Structure Type<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={newStructure}
                onChange={(e) => setNewStructure(e.target.value)}
                placeholder="e.g. BHK"
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
                <FiPlus className="mr-1" /> Add Structure
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Existing Structures Table */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Structures ({types.length})
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          ) : types.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-gray-900 dark:text-white rounded-lg overflow-hidden min-w-[500px]">
                <thead>
                  <tr className="bg-blue-950 text-white dark:bg-gray-700">
                    <th className="p-3 text-left text-sm font-semibold border-b border-gray-200 dark:border-gray-600 w-16">
                      Sr No
                    </th>
                    <th className="p-3 text-left text-sm font-semibold border-b border-gray-200 dark:border-gray-600">
                      Structure Type
                    </th>
                    <th className="p-3 text-center text-sm font-semibold border-b border-gray-200 dark:border-gray-600 w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {types.map((s, idx) => (
                      <motion.tr
                        key={s.id}
                        className={`border-b border-gray-200 dark:border-gray-700 ${
                          idx % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-900"
                        } hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="p-3 text-sm">{idx + 1}</td>
                        <td className="p-3 text-sm font-medium text-blue-800 dark:text-blue-300">
                          {editingId === s.id ? (
                            <input
                              value={editingValue}
                              onChange={(e) =>
                                setEditingValue(e.target.value)
                              }
                              className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded"
                            />
                          ) : (
                            s.structureType
                          )}
                        </td>
                        <td className="p-3 text-center text-sm flex justify-center gap-2">
                          {editingId === s.id ? (
                            <>
                              <button
                                onClick={() => saveEditing(s.id)}
                                className="text-green-600 hover:bg-green-100 dark:hover:bg-gray-700 p-1 rounded"
                              >
                                <FiCheck />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
                              >
                                <FiX />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  startEditing(s.id, s.structureType)
                                }
                                className="text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 p-1 rounded"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(s.id)}
                                className="text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 p-1 rounded"
                              >
                                <FiTrash2 />
                              </button>
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
              No flat/house structures have been configured yet.
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConfigureFlatHouseStructure;

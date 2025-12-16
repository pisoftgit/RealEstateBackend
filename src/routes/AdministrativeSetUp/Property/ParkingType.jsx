import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit, FiCheck, FiX } from "react-icons/fi";
import useParkingTypes from "../../../hooks/propertyConfig/useParkingType";

const ConfigureParkingType = () => {
  const {
    parkingTypes,
    loading,
    addParkingType,
    updateParkingType,
    deleteParkingType,
  } = useParkingTypes();

  const [newType, setNewType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const resetForm = () => {
    setNewType("");
    setEditingId(null);
    setEditingName("");
  };

  // ADD
  const handleAddParkingType = async (e) => {
    e.preventDefault();
    const name = newType.trim();
    if (!name) return;

    if (parkingTypes.some(p => p.type.toUpperCase() === name.toUpperCase())) {
      alert(`Parking type '${name}' already exists.`);
      return;
    }

    try {
      await addParkingType({ type: name });
      resetForm();
    } catch (err) {
      alert("Failed to add parking type.");
    }
  };

  // UPDATE
  const handleUpdateParkingType = async (id) => {
    const name = editingName.trim();
    if (!name) return;

    if (
      parkingTypes.some(
        (p) =>
          p.type.toUpperCase() === name.toUpperCase() &&
          p.id !== id
      )
    ) {
      alert(`Parking type '${name}' already exists.`);
      return;
    }

    try {
      await updateParkingType({ id, type: name });
      resetForm();
    } catch (err) {
      alert("Failed to update parking type.");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this parking type?"))
      return;

    try {
      await deleteParkingType(id);
    } catch (err) {
      alert("Failed to delete parking type.");
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10 ml-4">
        Parking Type Configuration
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* Add Form */}
        <motion.div
          className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 
                     border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white 
                         border-b pb-2">
            Add New Parking Type
          </h2>

          <form onSubmit={handleAddParkingType} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                Parking Type Name <span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="e.g., Covered, Basement, Open"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 
                           rounded-lg bg-gray-50 dark:bg-gray-700 
                           text-gray-900 dark:text-white text-sm"
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
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-4 py-2 text-sm font-medium 
                           rounded-lg bg-blue-950 text-white hover:bg-blue-700"
              >
                <FiPlus className="mr-1" /> Add Parking Type
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Parking Types Table */}
        <motion.div
          className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 
                     border border-gray-200 dark:border-gray-700 overflow-x-auto"
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white 
                         border-b pb-2">
            Existing Parking Types ({parkingTypes.length})
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          ) : parkingTypes.length === 0 ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              No parking types have been configured yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full border-collapse text-gray-900 dark:text-white 
                           rounded-lg overflow-hidden min-w-[500px]"
              >
                <thead>
                  <tr className="bg-blue-950 text-white dark:bg-gray-700">
                    <th className="p-3 text-left text-sm font-semibold w-16">
                      Sr No
                    </th>
                    <th className="p-3 text-left text-sm font-semibold">
                      Parking Type Name
                    </th>
                    <th className="p-3 text-center text-sm font-semibold w-28">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence initial={false}>
                    {parkingTypes.map((item, idx) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`border-b dark:border-gray-700 ${
                          idx % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-900"
                        }`}
                      >
                        <td className="p-3 text-sm">{idx + 1}</td>

                        <td className="p-3 text-sm font-medium text-blue-800 dark:text-blue-300">
                          {editingId === item.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="w-full p-1 border border-gray-300 dark:border-gray-600 
                                         rounded-md text-sm dark:bg-gray-700 dark:text-white"
                            />
                          ) : (
                            item.type
                          )}
                        </td>

                        <td className="p-3 text-center flex justify-center gap-2">
                          {editingId === item.id ? (
                            <>
                              <motion.button
                                onClick={() => handleUpdateParkingType(item.id)}
                                whileTap={{ scale: 0.8 }}
                                className="p-1 text-green-600 hover:bg-green-100 
                                           dark:hover:bg-gray-600 rounded-full"
                                title="Save"
                              >
                                <FiCheck size={16} />
                              </motion.button>

                              <motion.button
                                onClick={resetForm}
                                whileTap={{ scale: 0.8 }}
                                className="p-1 text-gray-600 hover:bg-gray-200 
                                           dark:hover:bg-gray-600 rounded-full"
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
                                whileTap={{ scale: 0.8 }}
                                className="p-1 text-blue-600 hover:bg-blue-100 
                                           dark:hover:bg-gray-600 rounded-full"
                                title="Edit"
                              >
                                <FiEdit size={16} />
                              </motion.button>

                              <motion.button
                                onClick={() => handleDelete(item.id)}
                                whileTap={{ scale: 0.8 }}
                                className="p-1 text-red-600 hover:bg-red-100 
                                           dark:hover:bg-gray-600 rounded-full"
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
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConfigureParkingType;

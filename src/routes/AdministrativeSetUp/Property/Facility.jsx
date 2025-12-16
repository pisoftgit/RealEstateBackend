import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit, FiCheck, FiX } from "react-icons/fi";
import useFacilities from "../../../hooks/propertyConfig/useAllFacilities";

const FacilitiesPageInline = () => {
  const [newFacilityName, setNewFacilityName] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const {
    facilities,
    loading,
    addFacility,
    updateFacility,
    deleteFacility,
  } = useFacilities();

  const resetNewForm = () => setNewFacilityName("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newFacilityName.trim()) return;

    const exists = facilities.some(
      (f) => f.facilityName.toLowerCase() === newFacilityName.toLowerCase()
    );
    if (exists) return alert("Facility already exists!");

    try {
      await addFacility({ facilityName: newFacilityName.trim() });
      resetNewForm();
    } catch (err) {
      console.error(err);
      alert("Failed to add facility.");
    }
  };

  const startEditing = (id, currentName) => {
    setEditingRowId(id);
    setEditingValue(currentName);
  };

  const cancelEditing = () => {
    setEditingRowId(null);
    setEditingValue("");
  };

  const saveEditing = async (id) => {
    if (!editingValue.trim()) return;

    const exists = facilities.some(
      (f) =>
        f.facilityName.toLowerCase() === editingValue.toLowerCase() && f.id !== id
    );
    if (exists) return alert("Facility already exists!");

    try {
      await updateFacility({ id, facilityName: editingValue.trim() });
      cancelEditing();
    } catch (err) {
      console.error(err);
      alert("Failed to update facility.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this facility?")) return;

    try {
      await deleteFacility(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete facility.");
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10 ml-4">
        Facilities Configuration
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Add New Facility Form */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Facility
          </h2>

          <form onSubmit={handleAdd} className="flex gap-3 items-center">
            <input
              type="text"
              value={newFacilityName}
              onChange={(e) => setNewFacilityName(e.target.value)}
              placeholder="Enter facility name"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg 
              bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              required
            />
            <button
              type="submit"
              className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-950 hover:bg-blue-700 transition"
            >
              <FiPlus className="mr-1" /> Add
            </button>
          </form>
        </motion.div>

        {/* Facilities Table */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Facilities ({facilities.length})
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">Loading...</p>
          ) : facilities.length === 0 ? (
            <p className="py-10 text-center text-gray-500 dark:text-gray-400">
              No facilities added yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[400px]">
                <thead>
                  <tr className="bg-blue-950 text-white dark:bg-gray-700">
                    <th className="p-3 text-left text-sm border-b">Sr</th>
                    <th className="p-3 text-left text-sm border-b">Facility Name</th>
                    <th className="p-3 text-center text-sm border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {facilities.map((f, i) => (
                      <motion.tr
                        key={f.id}
                        className={`border-b ${
                          i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
                        }`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td className="p-3 text-sm">{i + 1}</td>
                        <td className="p-3 text-sm">
                          {editingRowId === f.id ? (
                            <input
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
                            />
                          ) : (
                            f.facilityName
                          )}
                        </td>
                        <td className="p-3 flex justify-center gap-3">
                          {editingRowId === f.id ? (
                            <>
                              <motion.button
                                onClick={() => saveEditing(f.id)}
                                className="p-1 text-green-600 hover:bg-green-100 rounded-full"
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiCheck size={18} />
                              </motion.button>
                              <motion.button
                                onClick={cancelEditing}
                                className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiX size={18} />
                              </motion.button>
                            </>
                          ) : (
                            <>
                              <motion.button
                                onClick={() => startEditing(f.id, f.facilityName)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiEdit size={18} />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(f.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiTrash2 size={18} />
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

export default FacilitiesPageInline;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit } from "react-icons/fi";
import useHolidayTypesActions from "../../../../hooks/HR/Holiday/useHolidayType"

const ConfigureHolidayType = () => {
  const [holidayType, setHolidayType] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editHolidayType, setEditHolidayType] = useState(null); 
  const {
    holidayTypes,
    loading,
    addHolidayType,
    deleteHolidayType,
    updateHolidayType,
  } = useHolidayTypesActions();
  
  const handleAddHolidayType = async (e) => {
    e.preventDefault();
    if (!holidayType.trim()) return;

    try {
      await addHolidayType(holidayType.trim());
      setHolidayType(""); // Reset the input field
    } catch (err) {
      console.error("Error adding holiday type:", err);
    }
  };

  // Handle deleting a holiday type
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this holiday type?")) {
      try {
        await deleteHolidayType(id);
      } catch (err) {
        console.error("Error deleting holiday type:", err);
      }
    }
  };

  // Handle opening the modal for editing
  const handleEdit = (holiday) => {
    setEditHolidayType(holiday); // Set the holiday to be edited
    setIsModalOpen(true); // Open the modal
  };

  // Handle updating the holiday type
  const handleUpdateHolidayType = async (e) => {
    e.preventDefault();
    if (!editHolidayType?.holidayName.trim()) return;

    try {
      await updateHolidayType(editHolidayType.id, editHolidayType.holidayName.trim());
      setIsModalOpen(false); // Close the modal after updating
      setEditHolidayType(null); // Clear the edit state
    } catch (err) {
      console.error("Error updating holiday type:", err);
    }
  };

  // Helper function to reset the form input
  const resetForm = () => setHolidayType("");

  return (
    <motion.div
      className="min-h-screen font-dm p-5 bg-gray-50 dark:bg-gray-900 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10">
        Holiday Type Configuration
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Add New Holiday Type Form */}
        <motion.div className="p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Holiday Type
          </h2>
          <form onSubmit={handleAddHolidayType} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Holiday Type Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={holidayType}
                onChange={(e) => setHolidayType(e.target.value)}
                placeholder="e.g., Public Holiday, Optional Holiday"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
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
                <FiPlus className="mr-1" /> Add Holiday Type
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Existing Holiday Types Table */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Holiday Types ({holidayTypes.length})
          </h2>

          <AnimatePresence>
            {holidayTypes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-gray-900 dark:text-white rounded-lg overflow-hidden min-w-[400px]">
                  <thead>
                    <tr className="bg-blue-950 text-white dark:bg-gray-700">
                      <th className="p-3 text-left text-sm font-semibold border-b border-gray-200 dark:border-gray-600 w-16">Sr No</th>
                      <th className="p-3 text-left text-sm font-semibold border-b border-gray-200 dark:border-gray-600">Holiday Type</th>
                      <th className="p-3 text-center text-sm font-semibold border-b border-gray-200 dark:border-gray-600 w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {holidayTypes.map((h, i) => (
                        <motion.tr
                          key={h.id}
                          className={`border-b border-gray-200 dark:border-gray-700 ${i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"} hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td className="p-3 text-sm">{i + 1}</td>
                          <td className="p-3 text-sm font-medium text-blue-800 dark:text-blue-300">{h.holidayName}</td>
                          <td className="p-3 text-center text-sm">
                            <motion.button
                              onClick={() => handleEdit(h)} // Open modal for editing
                              title="Edit"
                              className="p-1 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-gray-600 rounded-full"
                              whileTap={{ scale: 0.8 }}
                            >
                              <FiEdit size={16} />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(h.id)} // Delete holiday type
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
                No holiday types have been configured yet.
              </p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Update Holiday Type Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-96"
              initial={{ y: "-50vh" }}
              animate={{ y: 0 }}
              exit={{ y: "50vh" }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4 text-blue-950 dark:text-white">Edit Holiday Type</h2>
              <form onSubmit={handleUpdateHolidayType}>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Holiday Type Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={editHolidayType?.holidayName || ""}
                    onChange={(e) =>
                      setEditHolidayType({ ...editHolidayType, holidayName: e.target.value })
                    }
                    placeholder="e.g., Public Holiday, Optional Holiday"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <motion.button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700"
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
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

export default ConfigureHolidayType;

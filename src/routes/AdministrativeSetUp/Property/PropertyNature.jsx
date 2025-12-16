import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit3, FiCheck, FiX } from "react-icons/fi";
import usePropertyNature from "../../../hooks/propertyConfig/PropertyNatureHook";

const ConfigurePropertyNature = () => {
  const {
    propertyNatures,
    loading,
    addPropertyNature,
    updatePropertyNature,
    deletePropertyNature,
  } = usePropertyNature();

  const [propertyNature, setPropertyNature] = useState("");

  // EDIT STATES
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // ADD new property nature
  const handleAddPropertyNature = async (e) => {
    e.preventDefault();
    if (!propertyNature.trim()) return;

    try {
      await addPropertyNature({ propertyNature });
      setPropertyNature("");
    } catch (error) {
      console.error("Add failed", error);
      alert("Failed to add property nature.");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property nature?")) return;

    try {
      await deletePropertyNature(id);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete property nature.");
    }
  };

  // START EDITING
  const handleEdit = (item) => {
    setEditId(item.id);
    setEditValue(item.propertyNature);
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditId(null);
    setEditValue("");
  };

  // SAVE UPDATE
  const handleUpdate = async (id) => {
    if (!editValue.trim()) return alert("Name cannot be empty");

    try {
      await updatePropertyNature({ id, propertyNature: editValue });
      cancelEdit();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update property nature.");
    }
  };

  const resetForm = () => setPropertyNature("");

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10 ml-4">
        Property Nature Configuration
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* FORM */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Property Nature
          </h2>

          <form onSubmit={handleAddPropertyNature} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                Property Nature Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={propertyNature}
                onChange={(e) => setPropertyNature(e.target.value)}
                placeholder="e.g., Leasehold, Freehold, Power of Attorney"
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
                <FiPlus className="mr-1" /> Add Nature
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* TABLE */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Property Natures ({propertyNatures.length})
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          ) : propertyNatures.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden min-w-[400px] text-gray-900 dark:text-white">
                <thead>
                  <tr className="bg-blue-950 text-white dark:bg-gray-700">
                    <th className="p-3 text-left text-sm font-semibold w-16">Sr No</th>
                    <th className="p-3 text-left text-sm font-semibold">Property Nature</th>
                    <th className="p-3 text-center text-sm font-semibold w-32">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {propertyNatures.map((p, i) => (
                    <motion.tr
                      key={p.id}
                      className={`border-b border-gray-200 dark:border-gray-700 ${i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
                        } hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="p-3 text-sm">{i + 1}</td>

                      {/* EDITABLE CELL */}
                      <td className="p-3 text-sm font-medium text-blue-800 dark:text-blue-300">
                        {editId === p.id ? (
                          <motion.input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full p-2 rounded-xl bg-blue-100 dark:bg-gray-700 border border-blue-400"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                          />
                        ) : (
                          p.propertyNature
                        )}
                      </td>

                      {/* ACTION ICONS */}
                      <td className="p-3 text-center flex items-center justify-center gap-3">

                        {editId === p.id ? (
                          <>
                            <motion.button
                              onClick={() => handleUpdate(p.id)}
                              className="text-green-600 hover:text-green-700"
                              title="Save"
                              whileTap={{ scale: 0.8 }}
                            >
                              <FiCheck size={18} />
                            </motion.button>

                            <motion.button
                              onClick={cancelEdit}
                              className="text-gray-500 hover:text-gray-600"
                              title="Cancel"
                              whileTap={{ scale: 0.8 }}
                            >
                              <FiX size={18} />
                            </motion.button>
                          </>
                        ) : (
                          <>
                            <motion.button
                              onClick={() => handleEdit(p)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Edit"
                              whileTap={{ scale: 0.8 }}
                            >
                              <FiEdit3 size={18} />
                            </motion.button>

                            <motion.button
                              onClick={() => handleDelete(p.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete"
                              whileTap={{ scale: 0.8 }}
                            >
                              <FiTrash2 size={18} />
                            </motion.button>
                          </>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>

              </table>
            </div>
          ) : (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              No property natures found.
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConfigurePropertyNature;

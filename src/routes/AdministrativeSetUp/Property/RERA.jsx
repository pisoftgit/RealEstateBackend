import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit, FiCheck, FiX } from "react-icons/fi";
import useReras from "../../../hooks/propertyConfig/useRera";

const ConfigureRERAs = () => {
  const [reraName, setReraName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const { reras, loading, addRera, updateRera, deleteRera } = useReras();

  const resetForm = () => {
    setReraName("");
    setEditingId(null);
    setEditingName("");
  };

  const handleAddRera = async (e) => {
    e.preventDefault();
    if (!reraName.trim()) return;

    const exists = reras.some(
      (r) => r.name.trim().toUpperCase() === reraName.trim().toUpperCase()
    );
    if (exists) {
      alert(`The RERA name '${reraName.trim().toUpperCase()}' already exists.`);
      return;
    }

    try {
      await addRera({ name: reraName.trim().toUpperCase() });
      resetForm();
    } catch (err) {
      alert("Failed to add RERA. Please try again.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this RERA?")) return;
    try {
      await deleteRera(id);
    } catch (err) {
      alert("Failed to delete RERA. Please try again.");
      console.error(err);
    }
  };

  const startEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const cancelEdit = () => resetForm();

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return alert("RERA name cannot be empty");

    const exists = reras.some(
      (r) => r.name.trim().toUpperCase() === editingName.trim().toUpperCase() && r.id !== id
    );
    if (exists) {
      alert(`The RERA name '${editingName.trim().toUpperCase()}' already exists.`);
      return;
    }

    try {
      await updateRera({ id, name: editingName.trim().toUpperCase() });
      resetForm();
    } catch (err) {
      alert("Failed to update RERA. Please try again.");
      console.error(err);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10 ml-4">
        RERA Configuration
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Add New RERA Form */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New RERA Authority
          </h2>
          <form onSubmit={handleAddRera} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                RERA Name (State/UT Code) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={reraName}
                onChange={(e) => setReraName(e.target.value)}
                placeholder="e.g., UPRERA, HRERA"
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
                <FiPlus className="mr-1" /> Add RERA
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Existing RERAs Table */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing RERA Authorities ({reras.length})
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          ) : reras.length === 0 ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              No RERA authorities have been configured yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-gray-900 dark:text-white rounded-lg overflow-hidden min-w-[500px]">
                <thead>
                  <tr className="bg-blue-950 text-white dark:bg-gray-700">
                    <th className="p-3 text-left text-sm font-semibold border-b border-gray-200 dark:border-gray-600 w-16">Sr No</th>
                    <th className="p-3 text-left text-sm font-semibold border-b border-gray-200 dark:border-gray-600">RERA Name</th>
                    <th className="p-3 text-center text-sm font-semibold border-b border-gray-200 dark:border-gray-600 w-24">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {reras.map((r, idx) => (
                      <motion.tr
                        key={r.id}
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
                          {editingId === r.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                            />
                          ) : (
                            r.name
                          )}
                        </td>
                        <td className="p-3 text-center text-sm flex justify-center gap-2">
                          {editingId === r.id ? (
                            <>
                              <motion.button
                                onClick={() => handleUpdate(r.id)}
                                className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-gray-600 rounded-full"
                                whileTap={{ scale: 0.8 }}
                                title="Save"
                              >
                                <FiCheck size={16} />
                              </motion.button>
                              <motion.button
                                onClick={cancelEdit}
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
                                onClick={() => startEdit(r.id, r.name)}
                                className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full"
                                whileTap={{ scale: 0.8 }}
                                title="Edit"
                              >
                                <FiEdit size={16} />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(r.id)}
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
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConfigureRERAs;

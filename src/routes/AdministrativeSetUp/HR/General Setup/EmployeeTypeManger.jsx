import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import useEmployeeTypeActions from "../../../../hooks/HR/GeneralSetup/useEmployeeType";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const EmployeeTypeManager = () => {
  const {
    employeeTypes,
    loading,
    addEmployeeType,
    updateEmployeeType,
    deleteEmployeeType,
  } = useEmployeeTypeActions();

  const [newEmployeeType, setNewEmployeeType] = useState("");
  const [codeApplicable, setCodeApplicable] = useState("Yes");

  // Modal state
  const [editingType, setEditingType] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCodeApplicable, setEditCodeApplicable] = useState("Yes");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /** ---------------------------
   * Add Employee Type
   * --------------------------- */
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newEmployeeType.trim()) return;

    try {
      await addEmployeeType(newEmployeeType.trim(), codeApplicable === "Yes");
      setNewEmployeeType("");
      setCodeApplicable("Yes");
    } catch (err) {
      alert("Failed to add employee type. See console for details.");
      console.error(err);
    }
  };

  /** ---------------------------
   * Open Edit Modal
   * --------------------------- */
  const openEditModal = (type) => {
    setEditingType(type);
    setEditName(type.name);
    setEditCodeApplicable(type.codeApplicable);
  };

  /** ---------------------------
   * Update Employee Type
   * --------------------------- */
  const handleUpdate = async () => {
    if (!editName.trim()) return;
    try {
      await updateEmployeeType(editingType.id, editName.trim(), editCodeApplicable === "Yes");
      setEditingType(null);
    } catch (err) {
      alert("Failed to update employee type. See console for details.");
      console.error(err);
    }
  };

  /** ---------------------------
   * Open Delete Modal
   * --------------------------- */
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  /** ---------------------------
   * Confirm Delete
   * --------------------------- */
  const handleDelete = async () => {
    try {
      await deleteEmployeeType(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      alert("Failed to delete employee type. See console for details.");
      console.error(err);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 font-dm bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1 className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white mb-10">
        Configure Employee Type
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <motion.div
          className="lg:col-span-1 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add Employee Type
          </h2>
          <form onSubmit={handleAdd} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Employee Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newEmployeeType}
                onChange={(e) => setNewEmployeeType(e.target.value)}
                placeholder="Enter employee type"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Employee Code Applicable
              </label>
              <div className="flex gap-5">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="codeApplicable"
                    value="Yes"
                    checked={codeApplicable === "Yes"}
                    onChange={(e) => setCodeApplicable(e.target.value)}
                    className="accent-blue-600"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="codeApplicable"
                    value="No"
                    checked={codeApplicable === "No"}
                    onChange={(e) => setCodeApplicable(e.target.value)}
                    className="accent-blue-600"
                  />
                  No
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setNewEmployeeType(""); setCodeApplicable("Yes"); }}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
              >
                Reset
              </button>
              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700 transition-colors shadow-lg"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> Add Employee Type
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Existing Employee Types */}
        <motion.div
          className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Employee Type(s) ({employeeTypes.length})
          </h2>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Sr No</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Employee Type</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Employee Code Applicable</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {employeeTypes.map((e, idx) => (
                      <motion.tr
                        key={e.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{idx + 1}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{e.name}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{e.code}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(e)}
                              className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 transition"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(e.id)}
                              className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 transition"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
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

      {/* Edit Modal */}
      {editingType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-950 dark:text-white">Edit Employee Type</h2>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-2 border rounded mb-3 text-gray-900 dark:text-white dark:bg-gray-700"
            />
            <div className="mb-3 flex gap-5">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Yes"
                  checked={editCodeApplicable === "Yes"}
                  onChange={(e) => setEditCodeApplicable(e.target.value)}
                  className="accent-blue-600"
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="No"
                  checked={editCodeApplicable === "No"}
                  onChange={(e) => setEditCodeApplicable(e.target.value)}
                  className="accent-blue-600"
                />
                No
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingType(null)}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 rounded bg-blue-950 text-white hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-80 shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-950 dark:text-white">Confirm Delete</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to delete this employee type?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default EmployeeTypeManager;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiMap } from "react-icons/fi";
import useRelievingReasonActions from "../../../../hooks/HR/GeneralSetup/useRelievingReason";

const RelievingReasonManager = () => {
  const { reasons, loading, addReason, updateReason, deleteReason } = useRelievingReasonActions();
  
  const [newReason, setNewReason] = useState("");
  const [editModal, setEditModal] = useState({ open: false, id: null, name: "" });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  /** -------------------------------
   *   Handle Add Reason
   * --------------------------------
   */
  const handleAddReason = async (e) => {
    e.preventDefault();
    if (!newReason.trim()) return;
    try {
      await addReason(newReason.trim());
      setNewReason("");
    } catch (err) {
      alert("Failed to add reason. Check console for details.");
      console.error(err);
    }
  };

  /** -------------------------------
   *   Handle Update Reason
   * --------------------------------
   */
  const handleUpdateReason = async () => {
    if (!editModal.name.trim()) return;
    try {
      await updateReason(editModal.id, editModal.name.trim());
      setEditModal({ open: false, id: null, name: "" });
    } catch (err) {
      alert("Failed to update reason. Check console for details.");
      console.error(err);
    }
  };

  /** -------------------------------
   *   Handle Delete Reason
   * --------------------------------
   */
  const handleDeleteReason = async () => {
    try {
      await deleteReason(deleteModal.id);
      setDeleteModal({ open: false, id: null });
    } catch (err) {
      alert("Failed to delete reason. Check console for details.");
      console.error(err);
    }
  };

  return (
    <motion.div
      className="min-h-screen font-dm p-5 bg-gray-50 dark:bg-gray-900 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10">
        Relieving Reason Manager
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <motion.div className="p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Configure New Reason
          </h2>
          <form onSubmit={handleAddReason} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Reason For Relieving
              </label>
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="e.g., Unsuitable Behaviour"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setNewReason("")}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
              >
                Reset
              </button>
              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> Add Reason
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* List */}
        <motion.div className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Reasons ({reasons.length})
          </h2>

          {loading ? (
            <p className="text-gray-500 text-center py-10">Loading...</p>
          ) : (
            <AnimatePresence>
              {reasons.length > 0 ? (
                <motion.div className="space-y-3">
                  {reasons.map((r) => (
                    <motion.div
                      key={r.id}
                      className="flex justify-between items-center p-4 rounded-xl shadow-md border-2 border-dashed border-blue-600 bg-white dark:bg-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <div className="flex items-center text-lg font-semibold text-blue-950 dark:text-blue-300">
                        <FiMap className="mr-2 text-blue-600" /> {r.name}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditModal({ open: true, id: r.id, name: r.name })}
                          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: r.id })}
                          className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <p className="text-center py-10 text-gray-500">
                  No reasons found. Add one using the form on the left.
                </p>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* -----------------------
          Edit Modal
      ----------------------- */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-950 dark:text-white">
              Edit Reason
            </h3>
            <input
              type="text"
              value={editModal.name}
              onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModal({ open: false, id: null, name: "" })}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateReason}
                className="px-4 py-2 rounded-lg bg-blue-950 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -----------------------
          Delete Modal
      ----------------------- */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              Confirm Delete
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-200">
              Are you sure you want to delete this reason?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReason}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RelievingReasonManager;

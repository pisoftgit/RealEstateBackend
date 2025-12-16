import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import useDurationActions from "../../../../hooks/HR/GeneralSetup/useDuration";

function Duration() {
  const [durationData, setDurationData] = useState({ status: "", salaryDeduction: "" });
  const [editDuration, setEditDuration] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { durations, addDuration, updateDuration, deleteDuration } =
    useDurationActions();

  // =============================================
  // ADD DURATION
  // =============================================
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!durationData.status.trim()) return;

    await addDuration(durationData);
    setDurationData({ status: "", salaryDeduction: "" });
  };

  // =============================================
  // OPEN EDIT MODAL
  // =============================================
  const openEditModal = (d) => {
    setEditDuration({ ...d });
    setIsEditModalOpen(true);
  };

  // =============================================
  // UPDATE DURATION
  // =============================================
  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateDuration(editDuration.id, editDuration);
    setIsEditModalOpen(false);
  };

  // =============================================
  // DELETE
  // =============================================
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    await deleteDuration(deleteId);
    setIsDeleteModalOpen(false);
  };

  return (
    <motion.div
      className="min-h-screen p-6 bg-gray-50 font-dm dark:bg-gray-900 font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-8 text-blue-950 dark:text-white">
        Duration Setup
      </h1>

      <div className="max-w-3xl mx-auto space-y-10">
        {/* ==================== ADD FORM ==================== */}
        <motion.div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border">
          <h2 className="text-xl font-bold mb-4 text-blue-950 dark:text-white">Add Duration</h2>

          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter Duration Name"
              value={durationData.status}
              onChange={(e) => setDurationData({ ...durationData, status: e.target.value })}
              className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700"
              required
            />
            <input
              type="number"
              placeholder="Salary Deduction"
              value={durationData.salaryDeduction}
              onChange={(e) =>
                setDurationData({ ...durationData, salaryDeduction: e.target.value })
              }
              className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700"
            />

            <motion.button
              type="submit"
              className="px-4 py-2 bg-blue-950 text-white rounded-lg flex items-center"
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus className="mr-1" /> Add
            </motion.button>
          </form>
        </motion.div>

        {/* ==================== TABLE ==================== */}
        <motion.div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border">
          <h2 className="text-xl font-bold mb-4 text-blue-950 dark:text-white">Existing Durations</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-950 text-white">
                <th className="p-3 text-left text-blue-950 dark:text-white">#</th>
                <th className="p-3 text-left text-blue-950 dark:text-white">Duration Name</th>
                <th className="p-3 text-left text-blue-950 dark:text-white">Salary Deduction</th>
                <th className="p-3 text-center text-blue-950 dark:text-white">Action</th>
              </tr>
            </thead>

            <tbody>
              {durations.map((d, i) => (
                <tr key={d.id} className="border-b">
                  <td className="p-3 text-blue-950 dark:text-white">{i + 1}</td>
                  <td className="p-3 text-blue-950 dark:text-white">{d.status}</td>
                  <td className="p-3 text-blue-950 dark:text-white">{d.salaryDeduction}</td>

                  <td className="p-3 text-center">
                    <button
                      className="text-yellow-500 mr-3"
                      onClick={() => openEditModal(d)}
                    >
                      <FiEdit size={18} />
                    </button>

                    <button
                      className="text-red-600"
                      onClick={() => openDeleteModal(d.id)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* ==================== EDIT MODAL ==================== */}
      <AnimatePresence>
        {isEditModalOpen && editDuration && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <h2 className="text-xl font-bold mb-4">Edit Duration</h2>

              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  value={editDuration.status}
                  onChange={(e) =>
                    setEditDuration({ ...editDuration, status: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="number"
                  value={editDuration.salaryDeduction}
                  onChange={(e) =>
                    setEditDuration({ ...editDuration, salaryDeduction: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg"
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-950 text-white rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== DELETE MODAL ==================== */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl w-80 shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <h2 className="text-xl font-bold mb-4">Delete Duration?</h2>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this duration?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Duration;

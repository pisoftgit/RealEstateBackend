import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import useAttendanceNotationActions from "../../../../hooks/HR/GeneralSetup/useAttendenceNotation"; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const AttendanceNotation = () => {
  const { notations, loading, addNotation, updateNotation, deleteNotation } =
    useAttendanceNotationActions();

  const [newNotation, setNewNotation] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newColor, setNewColor] = useState("#ffffff");
  const [newDesc, setNewDesc] = useState("");

  // Edit Modal state
  const [editing, setEditing] = useState(null);
  const [editNotation, setEditNotation] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editColor, setEditColor] = useState("#ffffff");
  const [editDesc, setEditDesc] = useState("");

  // Delete Modal state
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /** -------------------------------
   *   Handle Add
   * -------------------------------- */
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newNotation || !newCode || !newDesc) return;

    try {
      await addNotation({
        attendanceNotation: newNotation,
        attendanceNotationCode: newCode,
        color: newColor,
        description: newDesc,
      });
      setNewNotation("");
      setNewCode("");
      setNewColor("#ffffff");
      setNewDesc("");
    } catch (err) {
      alert("Failed to add notation. See console for details.");
      console.error(err);
    }
  };

  /** -------------------------------
   *   Open Edit Modal
   * -------------------------------- */
  const openEditModal = (notation) => {
    setEditing(notation);
    setEditNotation(notation.attendanceNotation);
    setEditCode(notation.attendanceNotationCode);
    setEditColor(notation.color);
    setEditDesc(notation.description);
  };

  /** -------------------------------
   *   Update Notation
   * -------------------------------- */
  const handleUpdate = async () => {
    if (!editNotation || !editCode || !editDesc) return;
    try {
      await updateNotation(editing.id, {
        attendanceNotation: editNotation,
        attendanceNotationCode: editCode,
        color: editColor,
        description: editDesc,
      });
      setEditing(null);
    } catch (err) {
      alert("Failed to update notation. See console for details.");
      console.error(err);
    }
  };

  /** -------------------------------
   *   Open Delete Modal
   * -------------------------------- */
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  /** -------------------------------
   *   Confirm Delete
   * -------------------------------- */
  const handleDelete = async () => {
    try {
      await deleteNotation(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      alert("Failed to delete notation. See console for details.");
      console.error(err);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 font-dm bg-gray-50 dark:bg-gray-900 transition-colors duration-500 font-dm"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white mb-10 select-none"
        variants={itemVariants}
      >
        Configure Attendance Notation
      </motion.h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Notation Form */}
        <motion.div
          className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add Attendance Notation
          </h2>

          <form onSubmit={handleAdd} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Attendance Notation *
              </label>
              <input
                type="text"
                value={newNotation}
                onChange={(e) => setNewNotation(e.target.value)}
                placeholder="e.g., PP"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Attendance Code *
              </label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g., 1"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Color
              </label>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-16 h-10 border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Description *
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="e.g., Present"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setNewNotation(""); setNewCode(""); setNewColor("#ffffff"); setNewDesc("");
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Reset
              </button>
              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700 shadow-lg"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> Add
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.div
          className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Attendance Code Reference
          </h2>

          <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="border px-3 py-2">Attendance</th>
                <th className="border px-3 py-2">Code</th>
              </tr>
            </thead>
            <tbody>
              {[
                { att: "Present", code: 1 },
                { att: "Absent", code: 2 },
                { att: "Medical Leave", code: 3 },
                { att: "Casual Leave", code: 4 },
                { att: "Maternity Leave", code: 5 },
                { att: "Leave Without Pay", code: 6 },
              ].map((a, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="border px-3 py-2">{a.att}</td>
                  <td className="border px-3 py-2">{a.code}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            * Please use the provided attendance codes when making entries.
          </p>
        </motion.div>

        {/* Existing Notations */}
        <motion.div
          className="lg:col-span-3 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Previously Added Attendance Notation
          </h2>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="border px-3 py-2">Sr No</th>
                    <th className="border px-3 py-2">Notation</th>
                    <th className="border px-3 py-2">Code</th>
                    <th className="border px-3 py-2">Color</th>
                    <th className="border px-3 py-2">Description</th>
                    <th className="border px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {notations.map((n, idx) => (
                      <motion.tr
                        key={n.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="border px-3 py-2">{idx + 1}</td>
                        <td className="border px-3 py-2">{n.attendanceNotation}</td>
                        <td className="border px-3 py-2">{n.attendanceNotationCode}</td>
                        <td className="border px-3 py-2">
                          <div
                            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: n.color }}
                          />
                        </td>
                        <td className="border px-3 py-2">{n.description}</td>
                        <td className="border px-3 py-2 flex gap-2 justify-center">
                          <button
                            onClick={() => openEditModal(n)}
                            className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(n.id)}
                            className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700"
                          >
                            <FiTrash2 size={18} />
                          </button>
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
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-950 dark:text-white">Edit Notation</h2>
            <input
              type="text"
              value={editNotation}
              onChange={(e) => setEditNotation(e.target.value)}
              className="w-full p-2 border rounded mb-2 text-gray-900 dark:text-white dark:bg-gray-700"
              placeholder="Notation"
            />
            <input
              type="text"
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
              className="w-full p-2 border rounded mb-2 text-gray-900 dark:text-white dark:bg-gray-700"
              placeholder="Code"
            />
            <div className="mb-2">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Color
              </label>
              <input
                type="color"
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
                className="w-16 h-10 border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full p-2 border rounded mb-4 text-gray-900 dark:text-white dark:bg-gray-700"
              placeholder="Description"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
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
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this attendance notation?
            </p>
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

export default AttendanceNotation;

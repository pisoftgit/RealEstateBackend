import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiMap } from "react-icons/fi";
import useLevelsConfigActions from "../../../../hooks/HR/Hierarchy/useLevel";

const LevelManager = () => {
  const { levels, loading, addLevel, updateLevel, deleteLevel } = useLevelsConfigActions();

  const [levelNo, setLevelNo] = useState("");
  const [levelName, setLevelName] = useState("");
  const [editModal, setEditModal] = useState({ open: false, id: null, levelNo: "", levelName: "" });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  /** -------------------------------
   *   Handle Add Level
   * --------------------------------
   */
  const handleAddLevel = async (e) => {
    e.preventDefault();
    if (!levelNo || !levelName.trim()) return;

    try {
      await addLevel(levelName.trim(), Number(levelNo));
      setLevelNo("");
      setLevelName("");
    } catch (err) {
      alert("Failed to add level. Check console for details.");
      console.error(err);
    }
  };

  /** -------------------------------
   *   Handle Update Level
   * --------------------------------
   */
  const handleUpdateLevel = async () => {
    if (!editModal.levelName.trim() || !editModal.levelNo) return;

    try {
      await updateLevel(editModal.id, editModal.levelName.trim(), Number(editModal.levelNo));
      setEditModal({ open: false, id: null, levelNo: "", levelName: "" });
    } catch (err) {
      alert("Failed to update level. Check console for details.");
      console.error(err);
    }
  };

  /** -------------------------------
   *   Handle Delete Level
   * --------------------------------
   */
  const handleDeleteLevel = async () => {
    try {
      await deleteLevel(deleteModal.id);
      setDeleteModal({ open: false, id: null });
    } catch (err) {
      alert("Failed to delete level. Check console for details.");
      console.error(err);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-7 bg-gray-50 dark:bg-gray-900 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10">
        Level Manager
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <motion.div className="p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Level
          </h2>
          <form onSubmit={handleAddLevel} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Level No</label>
              <input
                type="number"
                value={levelNo}
                onChange={(e) => setLevelNo(e.target.value)}
                placeholder="e.g., 10, 20, 30"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                min={0}
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Level Name</label>
              <input
                type="text"
                value={levelName}
                onChange={(e) => setLevelName(e.target.value)}
                placeholder="e.g., Junior Level"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setLevelNo("");
                  setLevelName("");
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
              >
                Reset
              </button>
              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> Add Level
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* List */}
        <motion.div className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Levels ({levels.length})
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500">Loading...</p>
          ) : (
            <AnimatePresence>
              {levels.length > 0 ? (
                <motion.div className="space-y-3">
                  {levels.map((l) => (
                    <motion.div
                      key={l.id}
                      className="flex justify-between items-center p-4 rounded-xl shadow-md border-2 border-dashed border-blue-600 bg-white dark:bg-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <div className="flex items-center text-lg font-semibold text-blue-950 dark:text-blue-300">
                        <FiMap className="mr-2 text-blue-600" /> 
                        <span className="font-mono text-blue-500 mr-2">[{l.maximumLevels}]</span>
                        {l.levelName}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditModal({ open: true, id: l.id, levelNo: l.maximumLevels, levelName: l.levelName })}
                          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: l.id })}
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
                  No levels found. Add one using the form on the left.
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
              Edit Level
            </h3>
            <input
              type="number"
              value={editModal.levelNo}
              onChange={(e) => setEditModal({ ...editModal, levelNo: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
              placeholder="Level No"
            />
            <input
              type="text"
              value={editModal.levelName}
              onChange={(e) => setEditModal({ ...editModal, levelName: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
              placeholder="Level Name"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModal({ open: false, id: null, levelNo: "", levelName: "" })}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateLevel}
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
              Are you sure you want to delete this level?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLevel}
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

export default LevelManager;

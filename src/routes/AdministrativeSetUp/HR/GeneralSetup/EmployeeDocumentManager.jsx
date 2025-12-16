import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import useDocumentNameActions from "../../../../hooks/HR/GeneralSetup/useDocumentName";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const EmployeeDocumentsManager = () => {
  const [docName, setDocName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  const { documents, addDocument, updateDocument, deleteDocument, loading } =
    useDocumentNameActions();

  /** --------------------------
   * Add or Update
   * -------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docName.trim()) return;

    try {
      if (editId) {
        // Update
        await updateDocument(editId, docName.trim(), description.trim());
        setEditId(null);
      } else {
        // Add
        await addDocument(docName.trim(), description.trim());
      }

      setDocName("");
      setDescription("");
    } catch (err) {
      console.error("Error saving document:", err);
    }
  };

  /** --------------------------
   * Edit document
   * -------------------------- */
  const handleEdit = (doc) => {
    setEditId(doc.id);
    setDocName(doc.name);
    setDescription(doc.description);
  };

  /** --------------------------
   * Delete document
   * -------------------------- */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(id);
      } catch (err) {
        console.error("Error deleting document:", err);
      }
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
        Configure Documents
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <motion.div
          className="lg:col-span-1 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            {editId ? "Edit Document" : "Add Document"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Document Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Enter document name"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description (optional)"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setDocName(""); setDescription(""); setEditId(null); }}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
              >
                Reset
              </button>
              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700 transition-colors shadow-lg"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> {editId ? "Update" : "Add"} Document
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Existing Documents */}
        <motion.div
          className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Document(s) ({documents.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Sr No</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Document Name</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Manage</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center">Loading...</td>
                    </tr>
                  ) : (
                    documents.map((d, idx) => (
                      <motion.tr
                        key={d.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{idx + 1}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{d.name}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{d.description}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(d)}
                              className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 transition"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 transition"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmployeeDocumentsManager;

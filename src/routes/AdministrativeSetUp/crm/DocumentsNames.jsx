import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiFileText } from "react-icons/fi";
import useRealEstateDocuments from "../../../hooks/AdminCRM/useRealEstateDocuments";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const CrmDocumentManager = () => {
  const {
    documents,
    loading,
    saveDocument,
    deleteDocument,
  } = useRealEstateDocuments();

  const [newDocName, setNewDocName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [editModal, setEditModal] = useState({
    open: false,
    id: null,
    documentName: "",
    description: "",
  });

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    await saveDocument({
      documentName: newDocName.trim(),
      description: newDescription.trim(),
    });

    setNewDocName("");
    setNewDescription("");
  };

  const openEditModal = (doc) => {
    setEditModal({
      open: true,
      id: doc.id,
      documentName: doc.documentName,
      description: doc.description || "",
    });
  };

  const handleEditSave = async () => {
    await saveDocument({
      id: editModal.id,
      documentName: editModal.documentName,
      description: editModal.description,
    });

    setEditModal({ open: false, id: null, documentName: "", description: "" });
  };

  const handleDeleteConfirm = async () => {
    await deleteDocument(deleteModal.id);
    setDeleteModal({ open: false, id: null });
  };

  const DocumentCard = ({ doc }) => (
    <motion.div
      className="flex justify-between items-start p-4 rounded-xl shadow-md border-2 border-dashed border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700"
      variants={itemVariants}
    >
      <div>
        <div className="flex items-center text-lg font-semibold text-blue-950 dark:text-blue-300">
          <FiFileText className="mr-2 text-blue-600 dark:text-blue-400" />
          {doc.documentName}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
          {doc.description || "No description"}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => openEditModal(doc)}
          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700"
        >
          <FiEdit size={18} />
        </button>

        <button
          onClick={() => setDeleteModal({ open: true, id: doc.id })}
          className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen p-5 font-sans bg-gray-50 dark:bg-gray-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10">
        CRM Document Manager
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div className="p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Document
          </h2>

          <form onSubmit={handleAddDocument} className="space-y-5">
            <input
              type="text"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              placeholder="Document Name"
              className="w-full p-3 rounded-lg border dark:bg-gray-700"
              required
            />

            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-3 rounded-lg border dark:bg-gray-700"
              rows={3}
            ></textarea>

            <motion.button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              whileTap={{ scale: 0.97 }}
            >
              <FiPlus className="inline mr-1" />
              Add Document
            </motion.button>
          </form>
        </motion.div>

        <motion.div className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Documents ({documents.length})
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editModal.open && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <h2 className="text-xl font-bold mb-4">Edit Document</h2>

              <input
                type="text"
                value={editModal.documentName}
                onChange={(e) =>
                  setEditModal({ ...editModal, documentName: e.target.value })
                }
                className="w-full p-3 rounded-lg border mb-3"
              />

              <textarea
                value={editModal.description}
                onChange={(e) =>
                  setEditModal({ ...editModal, description: e.target.value })
                }
                className="w-full p-3 rounded-lg border mb-4"
                rows={3}
              ></textarea>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setEditModal({
                      open: false,
                      id: null,
                      documentName: "",
                      description: "",
                    })
                  }
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteModal.open && (
          <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-80">
              <h3 className="text-lg font-bold mb-4">Confirm Delete?</h3>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, id: null })}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
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
};

export default CrmDocumentManager;

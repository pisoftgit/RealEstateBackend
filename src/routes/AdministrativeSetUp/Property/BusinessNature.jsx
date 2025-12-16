import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit } from "react-icons/fi";
import useBusinessNatureActions from "../../../hooks/propertyConfig/BusinessNaturehook";

const ConfigureBusinessNature = () => {
  const [nature, setNature] = useState("");
  const [code, setCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    businessNatures,
    loading,
    addBusinessNature,
    updateBusinessNature,
    deleteBusinessNature,
  } = useBusinessNatureActions();

  // Reset form fields
  const resetForm = () => {
    setNature("");
    setCode("");
    setEditingId(null);
    setIsEditing(false);
  };

  // Start editing a row
  const startEditing = (item) => {
    setNature(item.name);
    setCode(item.code.toString());
    setEditingId(item.id);
    setIsEditing(true);
  };

  // Add or Update Business Nature
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nature.trim() || !String(code).trim()) return;

    const codeExists = businessNatures.some(
      (b) => b.code?.toString() === code.toString().trim() && b.id !== editingId
    );

    if (codeExists) {
      alert(`The code '${code.trim()}' already exists!`);
      return;
    }

    try {
      if (isEditing) {
        // Update
        await updateBusinessNature({
          id: editingId,
          nature: nature.trim(),
          code: Number(code),
        });
      } else {
        // Add
        await addBusinessNature({
          nature: nature.trim(),
          code: Number(code),
        });
      }

      resetForm();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${isEditing ? "update" : "add"} business nature.`);
    }
  };

  // Delete Business Nature
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this business nature?")) return;

    try {
      await deleteBusinessNature(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete business nature.");
    }
  };

  return (
    <motion.div
  className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>

      <h1 className="ml-4 text-3xl font-bold text-blue-950 dark:text-white mb-10">
        Business Nature Configuration
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Form */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            {isEditing ? "Update Business Nature" : "Add New Business Nature"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                  Nature Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={nature}
                  onChange={(e) => setNature(e.target.value)}
                  placeholder="e.g., Distributor"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                  Nature Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g., 4"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 
                bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 transition"
              >
                {isEditing ? "Cancel" : "Reset"}
              </button>

              <motion.button
                type="submit"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white  
                ${isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-950 hover:bg-blue-700"}`}
                whileTap={{ scale: 0.98 }}
              >
                {isEditing ? (
                  <>
                    <FiEdit className="mr-1" /> Update Nature
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-1" /> Add Nature
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Table */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Business Natures ({businessNatures.length})
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">Loading...</p>
          ) : businessNatures.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-blue-950 text-white dark:bg-gray-700">
                    <th className="p-3 text-left text-sm border-b">Sr</th>
                    <th className="p-3 text-left text-sm border-b">Nature</th>
                    <th className="p-3 text-left text-sm border-b">Code</th>
                    <th className="p-3 text-center text-sm border-b">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {businessNatures.map((b, i) => (
                      <motion.tr
                        key={b.id}
                        className={`border-b ${
                          i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
                        }`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td className="p-3 text-sm">{i + 1}</td>
                        <td className="p-3 text-sm">{b.name}</td>
                        <td className="p-3 text-sm">{b.code}</td>
                        <td className="p-3 flex justify-center gap-3">
                          {/* Edit */}
                          <motion.button
                            onClick={() => startEditing(b)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiEdit size={18} />
                          </motion.button>

                          {/* Delete */}
                          <motion.button
                            onClick={() => handleDelete(b.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiTrash2 size={18} />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-10 text-center text-gray-500 dark:text-gray-400">
              No business natures configured yet.
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConfigureBusinessNature;

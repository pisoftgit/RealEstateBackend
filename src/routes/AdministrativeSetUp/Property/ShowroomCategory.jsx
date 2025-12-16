import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit, FiCheck, FiX } from "react-icons/fi";
import useShopShowroomCategories from "../../../hooks/propertyConfig/useShopShowroomCategories";

const ConfigureShopCategory = () => {
  const [category, setCategory] = useState("");

  // For editing
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useShopShowroomCategories();

  const resetForm = () => {
    setCategory("");
    setEditingId(null);
    setEditingValue("");
  };

  // ADD CATEGORY
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const newName = category.trim();
    if (!newName) return;

    // Duplicate check
    const exists = categories.some(
      (c) => c.categoryName.trim().toLowerCase() === newName.toLowerCase()
    );
    if (exists) {
      alert(`The category '${newName}' already exists.`);
      return;
    }

    try {
      await addCategory({ categoryName: newName });
      resetForm();
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  // UPDATE CATEGORY
  const handleUpdate = async (id) => {
    const newName = editingValue.trim();
    if (!newName) return;

    // Duplicate check
    const exists = categories.some(
      (c) =>
        c.categoryName.trim().toLowerCase() === newName.toLowerCase() &&
        c.id !== id
    );
    if (exists) {
      alert(`The category '${newName}' already exists.`);
      return;
    }

    try {
      await updateCategory({ id, categoryName: newName });
      resetForm();
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  };

  // DELETE CATEGORY
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id);
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10 ml-4">
        Shop/Showroom Category Configuration
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* ADD FORM */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Shop/Showroom Category
          </h2>

          <form onSubmit={handleAddCategory} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                Category Name <span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Clothing Store, Salon, Bank"
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
                <FiPlus className="mr-1" /> Add Category
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* TABLE */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Categories ({categories.length})
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              Loading categories...
            </p>
          ) : categories.length === 0 ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              No categories have been configured yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-gray-900 dark:text-white rounded-lg overflow-hidden min-w-[500px]">
                <thead>
                  <tr className="bg-blue-950 text-white dark:bg-gray-700">
                    <th className="p-3 text-left text-sm font-semibold w-16">Sr No</th>
                    <th className="p-3 text-left text-sm font-semibold">Category Name</th>
                    <th className="p-3 text-center text-sm font-semibold w-28">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence initial={false}>
                    {categories.map((c, idx) => (
                      <motion.tr
                        key={c.id}
                        className={`border-b border-gray-200 dark:border-gray-700 ${
                          idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
                        }`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="p-3 text-sm">{idx + 1}</td>

                        {/* Editable Name */}
                        <td className="p-3 text-sm font-medium text-blue-800 dark:text-blue-300">
                          {editingId === c.id ? (
                            <input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                            />
                          ) : (
                            c.categoryName
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="flex justify-center gap-2 p-3 text-sm">

                          {editingId === c.id ? (
                            <>
                              {/* SAVE */}
                              <motion.button
                                onClick={() => handleUpdate(c.id)}
                                className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-gray-600 rounded-full"
                                whileTap={{ scale: 0.8 }}
                              >
                                <FiCheck size={16} />
                              </motion.button>

                              {/* CANCEL */}
                              <motion.button
                                onClick={resetForm}
                                className="p-1 text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                                whileTap={{ scale: 0.8 }}
                              >
                                <FiX size={16} />
                              </motion.button>
                            </>
                          ) : (
                            <>
                              {/* EDIT */}
                              <motion.button
                                onClick={() => {
                                  setEditingId(c.id);
                                  setEditingValue(c.categoryName);
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full"
                                whileTap={{ scale: 0.8 }}
                              >
                                <FiEdit size={16} />
                              </motion.button>

                              {/* DELETE */}
                              <motion.button
                                onClick={() => handleDelete(c.id)}
                                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full"
                                whileTap={{ scale: 0.8 }}
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

export default ConfigureShopCategory;

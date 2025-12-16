import React, { useState, useEffect } from "react";
import useCategoryActions from "../../../hooks/General/useCasteCategory"; 
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const CategoryCasteManager = () => {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategoryActions();
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState("");

  useEffect(() => {
    if (editingId !== null) {
      const categoryToEdit = categories.find((cat) => cat.id === editingId);
      setUpdatedCategory(categoryToEdit?.category || "");
    }
  }, [editingId, categories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategory) {
      await addCategory(newCategory);
      setNewCategory("");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (updatedCategory && editingId !== null) {
      await updateCategory(editingId, updatedCategory);
      setEditingId(null); // Reset the edit mode
      setUpdatedCategory(""); // Clear the update input
    }
  };

  const handleEditCategory = (id) => {
    setEditingId(id);
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors duration-500 font-dm"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white mb-10 ml-4"
        variants={itemVariants}
      >
        Category Manager
      </motion.h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Category Form */}
        <motion.div
          className="lg:col-span-1 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            {editingId ? "Update Category" : "Add New Category"}
          </h2>

          <form
            onSubmit={editingId ? handleUpdateCategory : handleAddCategory}
            className="space-y-5"
          >
            <div>
              <label className="text-gray-700 dark:text-gray-300 font-medium">Category Name</label>
              <input
                type="text"
                value={editingId ? updatedCategory : newCategory}
                onChange={(e) =>
                  editingId ? setUpdatedCategory(e.target.value) : setNewCategory(e.target.value)
                }
                placeholder="e.g. General, OBC"
                className="w-full p-3 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="submit"
                className="flex items-center px-4 py-2 rounded-lg bg-blue-950 text-white"
              >
                <FiPlus className="mr-1" />
                {editingId ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Existing Categories */}
        <motion.div
          className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-blue-950 dark:text-white">
            Existing Categories ({categories.length})
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading...</p>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    className="flex justify-between items-center p-4 rounded-xl shadow-md border-2 border-blue-600 bg-white dark:bg-gray-800"
                    variants={itemVariants}
                  >
                    <div>
                      <div className="text-lg font-semibold">{category.category}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category.id)}
                        className="p-2 rounded-full text-blue-600"
                      >
                        <FiEdit size={18} />
                      </button>

                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-2 rounded-full text-red-600"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CategoryCasteManager;

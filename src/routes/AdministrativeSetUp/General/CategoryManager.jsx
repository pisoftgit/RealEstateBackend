import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiTag,
    FiHash,
    FiEdit,
    FiTrash2,
    FiPlus,
    FiX,
    FiCheckCircle,
} from "react-icons/fi";

import useUserCategories from "../../../hooks/General/useUserCategory";
import { ToastContainer } from "react-toastify";

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

const UserCategoryManager = () => {
    const {
        categories,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
    } = useUserCategories();

    const [newCategory, setNewCategory] = useState({ name: "", code: "" });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);

    const handleAdd = async (e) => {
        e.preventDefault();
        await addCategory(newCategory);
        setNewCategory({ name: "", code: "" });
    };

    const openEditModal = (cat) => {
        setEditCategory({ ...cat }); // cat already has {id, name, code}
        setEditModalOpen(true);
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        await updateCategory(editCategory.id, {
            name: editCategory.name,
            code: editCategory.code,
        });
        setEditModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this Category?")) {
            await deleteCategory(id);
        }
    };

    return (
        <motion.div
            className="min-h-screen p-5 font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-500 font-dm"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.h1
                className="text-xl md:text-3xl font-bold text-blue-950 dark:text-white mb-10 font-dm ML-3"
                variants={itemVariants}
            >
                User Category Manager
            </motion.h1>

            <div className="max-w-6xl font-dm mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Form */}
                <motion.div
                    className="lg:col-span-1 p-5 font-dm rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <h2 className="text-2xl font-dm font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
                        Add New Category
                    </h2>

                    <form onSubmit={handleAdd} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                <FiTag className="inline mr-1 text-blue-600" /> Name
                            </label>
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) =>
                                    setNewCategory({ ...newCategory, name: e.target.value })
                                }
                                className="w-full p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            />
                        </div>

                        {/* Code */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                <FiHash className="inline mr-1 text-blue-600" /> Code
                            </label>
                            <input
                                type="text"
                                value={newCategory.code}
                                onChange={(e) =>
                                    setNewCategory({ ...newCategory, code: e.target.value })
                                }
                                className="w-full p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setNewCategory({ name: "", code: "" })}
                                className="px-4 py-2 text-sm rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-blue-950 text-white hover:bg-blue-700 flex items-center gap-1"
                            >
                                <FiPlus /> Add
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Categories Table */}
                <motion.div
                    className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
                        Existing Categories ({categories.length})
                    </h2>

                    {loading ? (
                        <p className="text-gray-500 dark:text-gray-300">Loading...</p>
                    ) : categories.length === 0 ? (
                        <p className="text-center py-10 text-gray-500 dark:text-gray-300">
                            No categories found.
                        </p>
                    ) : (
                        <table className="min-w-full border dark:border-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3 border dark:border-gray-700">#</th>
                                    <th className="p-3 border dark:border-gray-700">Name</th>
                                    <th className="p-3 border dark:border-gray-700">Code</th>
                                    <th className="p-3 border dark:border-gray-700 text-center">
                                        Manage
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.map((c, i) => (
                                    <tr
                                        key={c.id}
                                        className="hover:bg-blue-50 dark:hover:bg-gray-700"
                                    >
                                        <td className="p-3 border dark:border-gray-700">{i + 1}</td>
                                        <td className="p-3 border dark:border-gray-700">{c.name}</td>
                                        <td className="p-3 border dark:border-gray-700">{c.code}</td>
                                        <td className="p-3 border dark:border-gray-700 text-center">
                                            <button
                                                onClick={() => openEditModal(c)}
                                                className="text-blue-600 dark:text-blue-400 mr-3"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="text-red-600 dark:text-red-400"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </motion.div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editModalOpen && editCategory && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md relative"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="absolute right-4 top-4 text-gray-500 dark:text-gray-300"
                            >
                                <FiX size={22} />
                            </button>

                            <h3 className="text-2xl font-bold text-blue-950 dark:text-white mb-6">
                                <FiEdit className="inline mr-2" /> Edit Category
                            </h3>

                            <form onSubmit={handleEditSave} className="space-y-5">
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editCategory.name}
                                        onChange={(e) =>
                                            setEditCategory({
                                                ...editCategory,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                                        Code
                                    </label>
                                    <input
                                        type="text"
                                        value={editCategory.code}
                                        onChange={(e) =>
                                            setEditCategory({
                                                ...editCategory,
                                                code: e.target.value,
                                            })
                                        }
                                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-950 hover:bg-blue-700 p-3 rounded-lg text-white font-semibold flex justify-center items-center gap-2"
                                >
                                    <FiCheckCircle /> Save Changes
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <ToastContainer/>
        </motion.div>
    );
};

export default UserCategoryManager;

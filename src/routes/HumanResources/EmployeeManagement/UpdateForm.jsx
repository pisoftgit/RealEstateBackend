// UpdateForm.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const UpdateForm = ({ isOpen, employeeData, onClose, onSave, setFormData }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            onClick={onClose}
                        >
                            <FiX size={20} />
                        </button>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Edit Employee Details
                        </h3>

                        <div className="space-y-3">
                            {["name", "dept", "desig", "gender", "contact"].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                        {field}
                                    </label>
                                    <input
                                        type="text"
                                        value={employeeData[field] || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                [field]: e.target.value,
                                            }))
                                        }
                                        className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UpdateForm;

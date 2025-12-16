import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiBriefcase, FiX, FiRefreshCw } from "react-icons/fi";
// Ensure this path is correct for your project
import useDepartmentAPI from "../../../../hooks/HR/GeneralSetup/useDepartment"; 

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
  exit: { opacity: 0, height: 0, transition: { duration: 0.3 } }
};

// --- Modal Components (No change needed here as they use 'department.id' and 'department.name') ---

const Modal = ({ children, onClose }) => (
    <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md relative"
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
                <FiX size={20} />
            </button>
            {children}
        </motion.div>
    </motion.div>
);

const UpdateDepartmentModal = ({ department, onUpdate, onClose, loading }) => {
    // Note: department.name is used here, assuming the parent component maps the API name property correctly.
    const [name, setName] = useState(department.name); 

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() !== department.name && name.trim()) {
            onUpdate(department.id, name.trim());
        } else {
            onClose(); 
        }
    };

    return (
        <Modal onClose={onClose}>
            <h3 className="text-xl font-bold mb-4 text-blue-950 dark:text-white">Edit Department</h3>
            <form onSubmit={handleSubmit}>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Department Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter new department name"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 transition-all"
                    required
                />
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <motion.button
                        type="submit"
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
                        whileTap={{ scale: 0.98 }}
                        disabled={loading || !name.trim() || name.trim() === department.name}
                    >
                        {loading ? 'Updating...' : 'Save Changes'}
                    </motion.button>
                </div>
            </form>
        </Modal>
    );
};

const DeleteConfirmationModal = ({ department, onDelete, onClose, loading }) => {
    return (
        <Modal onClose={onClose}>
            <h3 className="text-xl font-bold mb-4 text-red-600">Confirm Deletion</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete the department: <strong className="font-semibold">"{department.name}"</strong>? This action cannot be undone.
                {department.designationCount > 0 && (
                    <span className="block mt-2 text-sm text-red-500">
                        Warning: This department has {department.designationCount} associated designation(s).
                    </span>
                )}
            </p>
            <div className="flex justify-end gap-3 mt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
                    disabled={loading}
                >
                    Cancel
                </button>
                <motion.button
                    onClick={() => onDelete(department.id)}
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                >
                    {loading ? 'Deleting...' : <><FiTrash2 className="mr-1" /> Delete</>}
                </motion.button>
            </div>
        </Modal>
    );
};

// --- DepartmentManager Component ---

const DepartmentManager = () => {
    const { 
        departments, 
        loading, 
        error, 
        fetchDepartments, 
        addDepartment, 
        updateDepartment, 
        deleteDepartment 
    } = useDepartmentAPI();

    const [deptName, setDeptName] = useState("");
    const [editModalDept, setEditModalDept] = useState(null);
    const [deleteModalDept, setDeleteModalDept] = useState(null);

    // --- CRUD Handlers ---

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        if (!deptName.trim()) return;

        const success = await addDepartment(deptName.trim());
        if (success) {
            setDeptName("");
        }
    };

    const handleUpdate = async (id, newName) => {
        const success = await updateDepartment(id, newName);
        if (success) {
            setEditModalDept(null); 
        }
    };

    const handleDelete = async (id) => {
        const success = await deleteDepartment(id);
        if (success) {
            setDeleteModalDept(null); 
        }
    };

    // --- Department Card Component ---

    // NOTE: This card now expects id and name as props, which are mapped below.
    const DepartmentCard = ({ id, name, designationCount, index }) => ( 
        <motion.div
            className="flex justify-between items-center p-4 rounded-xl shadow-md border-2 border-dashed border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            exit="exit" 
        >
            <div className="flex items-center text-lg font-semibold text-blue-950 dark:text-blue-300">
                <span className="mr-3 text-gray-500 text-sm">{index + 1}.</span>
                <FiBriefcase className="mr-2 text-blue-600 dark:text-blue-400" />
                {name}
                {designationCount > 0 && (
                    <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({designationCount} designations)
                    </span>
                )}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setEditModalDept({ id, name })} 
                    className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 transition"
                >
                    <FiEdit size={18} />
                </button>
                <button
                    // Pass designationCount to the delete modal for the warning message
                    onClick={() => setDeleteModalDept({ id, name, designationCount })} 
                    className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 transition"
                >
                    <FiTrash2 size={18} />
                </button>
            </div>
        </motion.div>
    );

    return (
        <>
            <motion.div
                className="min-h-screen p-5 font-dm bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <h1 className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white mb-10">
                    Configure Department
                </h1>

                {/* Error Banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div 
                            className="p-3 mb-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 font-medium"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            Error: {error}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section (Unchanged) */}
                    <motion.div
                        className="lg:col-span-1 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
                            Add New Department
                        </h2>

                        <form onSubmit={handleAddDepartment} className="space-y-5">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                    Department Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={deptName}
                                    onChange={(e) => setDeptName(e.target.value)}
                                    placeholder="e.g., Human Resources"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setDeptName("")}
                                    className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
                                    disabled={loading}
                                >
                                    Reset
                                </button>

                                <motion.button
                                    type="submit"
                                    className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading || !deptName.trim()}
                                >
                                    {loading ? 'Adding...' : <><FiPlus className="mr-1" /> Add Department</>}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Existing Departments */}
                    <motion.div
                        className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-between items-center border-b pb-2 mb-6">
                            <h2 className="text-2xl font-bold text-blue-950 dark:text-white">
                                Existing Department(s) ({departments.length})
                            </h2>
                            <motion.button
                                onClick={fetchDepartments}
                                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50"
                                title="Refresh Departments"
                                whileTap={{ rotate: 360 }}
                                disabled={loading}
                            >
                                <FiRefreshCw size={20} className={loading ? "animate-spin" : ""} />
                            </motion.button>
                        </div>
                        

                        <AnimatePresence mode="wait">
                            {loading && (
                                <motion.p 
                                    className="text-center py-10 text-blue-600 dark:text-blue-400 font-medium flex justify-center items-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <FiRefreshCw className="animate-spin mr-2" size={20} /> Loading departments...
                                </motion.p>
                            )}
                            {/* --- MAPPING LOGIC UPDATED HERE --- */}
                            {!loading && departments.length > 0 ? (
                                <motion.div className="space-y-3" variants={containerVariants}>
                                    <AnimatePresence>
                                        {departments.map((dept, index) => (
                                            <DepartmentCard
                                                key={dept.id} // Use the correct ID property
                                                id={dept.id}
                                                name={dept.department} // Use the correct name property
                                                designationCount={dept.list_desig ? dept.list_desig.length : 0}
                                                index={index}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            ) : !loading && (
                                <motion.p
                                    className="text-center py-10 text-gray-500 dark:text-gray-400"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                >
                                    No departments found. Add one using the form on the left.
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {editModalDept && (
                    <UpdateDepartmentModal 
                        department={editModalDept} 
                        onUpdate={handleUpdate} 
                        onClose={() => setEditModalDept(null)} 
                        loading={loading}
                    />
                )}
                {deleteModalDept && (
                    <DeleteConfirmationModal
                        department={deleteModalDept}
                        onDelete={handleDelete}
                        onClose={() => setDeleteModalDept(null)}
                        loading={loading}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default DepartmentManager;
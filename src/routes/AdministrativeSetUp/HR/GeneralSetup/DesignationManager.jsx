import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiBriefcase, FiX, FiRefreshCw } from "react-icons/fi";
import useDesignationActions from "../../../../hooks/HR/GeneralSetup/UseDesignation";
import useDepartmentAPI from "../../../../hooks/HR/GeneralSetup/useDepartment"; 


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};

// Edit Designation Modal
const EditDesignationForm = ({ designation, onUpdate, onCancel, loading, departments }) => {
  const [dept, setDept] = useState(designation.department.id || "");
  const [name, setName] = useState(designation.name);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdate(designation.id, dept, name.trim());
    } else {
      onCancel();
    }
  };

  return (
    <motion.div className="fixed inset-0 font-dm z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md relative"
        initial={{ y: -50, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
          <FiX size={20} />
        </button>
        <h3 className="text-xl font-bold mb-4 text-blue-950 dark:text-white">Edit Designation</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Department</label>
            <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full p-2 border rounded-lg">
              <option value="">--- Select Department ---</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.department}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Designation</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-lg" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700" disabled={loading}>Cancel</button>
            <motion.button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white" whileTap={{ scale: 0.98 }} disabled={loading || !name.trim()}>
              {loading ? "Updating..." : "Update"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Delete confirmation
const DeleteDesignationConfirm = ({ designation, onDelete, onCancel, loading }) => (
  <motion.div className="fixed inset-0 font-dm z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md relative"
      initial={{ y: -50, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 50, opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
      <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
        <FiX size={20} />
      </button>
      <h3 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Are you sure you want to delete the designation: <strong>"{designation.name}"</strong>?
      </p>
      <div className="flex justify-end gap-3 mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700" disabled={loading}>Cancel</button>
        <motion.button onClick={() => onDelete(designation.id)} className="px-4 py-2 rounded-lg bg-red-600 text-white" whileTap={{ scale: 0.98 }} disabled={loading}>
          {loading ? "Deleting..." : <><FiTrash2 className="mr-1" /> Delete</>}
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

const DesignationManager = () => {
  const { designations = [], loading, fetchDesignations, addDesignation, updateDesignation, deleteDesignation } = useDesignationActions();
  const { departments = [], loading: deptLoading } = useDepartmentAPI(); // dynamic departments

  const [dept, setDept] = useState("");
  const [designationName, setDesignationName] = useState("");
  const [editDesignation, setEditDesignation] = useState(null);
  const [deleteDesignationConfirm, setDeleteDesignationConfirm] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!dept || !designationName.trim()) return;
    await addDesignation(dept, designationName.trim());
    setDept(""); setDesignationName("");
  };

  const handleUpdate = async (id, department, name) => {
    await updateDesignation(id, department, name);
    setEditDesignation(null);
  };

  const handleDelete = async (id) => {
    await deleteDesignation(id);
    setDeleteDesignationConfirm(null);
  };

  return (
    <>
      <motion.div className="min-h-screen font-dm p-5 font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
        initial="hidden" animate="visible" variants={containerVariants}>
        <h1 className="text-3xl md:text-4xl font-dm font-bold text-blue-950 dark:text-white mb-10">Configure Designation</h1>

        <div className="max-w-6xl font-dm  mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Form */}
          <motion.div className="lg:col-span-1 font-dm  p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 font-dm  text-blue-950 dark:text-white border-b pb-2">Add New Designation</h2>
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="block text-gray-700  font-dm dark:text-gray-300 font-medium mb-2">Department</label>
                <select value={dept} onChange={(e) => setDept(e.target.value)}
                  className="w-full p-3 border border-gray-300 font-dm  dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" required>
                  <option value="">--- Select Department ---</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.department}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Designation</label>
                <input type="text" value={designationName} onChange={(e) => setDesignationName(e.target.value)}
                  placeholder="Enter designation" className="w-full font-dm  p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" required />
              </div>
              <div className="flex font-dm  justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setDept(""); setDesignationName(""); }}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300">Reset</button>
                <motion.button type="submit" className="flex items-center px-4 py-2 bg-blue-950 text-white rounded-lg shadow-lg" whileTap={{ scale: 0.98 }}>
                  <FiPlus className="mr-1" /> Add
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* List */}
          <motion.div className="lg:col-span-2 font-dm  p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center border-b pb-2 mb-6">
              <h2 className="text-2xl font-bold text-blue-950 dark:text-white">Existing Designations ({designations.length})</h2>
              <motion.button onClick={fetchDesignations} className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition" whileTap={{ rotate: 360 }}>
                <FiRefreshCw size={20} className={loading ? "animate-spin" : ""} />
              </motion.button>
            </div>

            <AnimatePresence>
              {loading && <motion.p className="text-center py-10 text-blue-600 dark:text-blue-400 font-medium">Loading...</motion.p>}
              {!loading && designations.length === 0 && <motion.p className="text-center py-10 text-gray-500 dark:text-gray-400">No designations found.</motion.p>}
              {!loading && designations.length > 0 && (
                <motion.div className="space-y-3" variants={containerVariants}>
                  {designations.map((d, idx) => (
                    <motion.div key={d.id} className="flex justify-between items-center p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all" variants={itemVariants} exit="exit">
                      <div className="flex items-center text-lg font-semibold text-blue-950 dark:text-blue-300">
                        <span className="mr-3 text-gray-500 text-sm">{idx + 1}.</span>
                        <FiBriefcase className="mr-2 text-blue-600 dark:text-blue-400" />
                        {d.name} ({d.department.department})
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditDesignation(d)} className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 transition"><FiEdit size={18} /></button>
                        <button onClick={() => setDeleteDesignationConfirm(d)} className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 transition"><FiTrash2 size={18} /></button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editDesignation && <EditDesignationForm designation={editDesignation} onUpdate={handleUpdate} onCancel={() => setEditDesignation(null)} loading={loading} departments={departments} />}
        {deleteDesignationConfirm && <DeleteDesignationConfirm designation={deleteDesignationConfirm} onDelete={handleDelete} onCancel={() => setDeleteDesignationConfirm(null)} loading={loading} />}
      </AnimatePresence>
    </>
  );
};

export default DesignationManager;

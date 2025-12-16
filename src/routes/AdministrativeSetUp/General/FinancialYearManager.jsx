import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiCheckCircle,
} from "react-icons/fi";

import useFinancialYearActions from "../../../hooks/General/useFinancialYear";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const FinancialYearManager = () => {
  const {
    financialYears,
    loading,
    addFinancialYear,
    updateFinancialYear,
    deleteFinancialYear,
    fetchFinancialYears,
  } = useFinancialYearActions();

  const [newYear, setNewYear] = useState({
    name: "",
    startDate: "",
    endDate: "",
    status: false,
  });

  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setNewYear({ name: "", startDate: "", endDate: "", status: false });
    setEditingId(null);
  };

  const handleEdit = (fy) => {
    setNewYear({
      name: fy.year,
      startDate: fy.startDate,
      endDate: fy.endDate,
      status: fy.status,
    });
    setEditingId(fy.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newYear.name || !newYear.startDate || !newYear.endDate) return;

    try {
      if (editingId) {
        await updateFinancialYear({
          id: editingId,
          year: newYear.name,
          startDate: newYear.startDate,
          endDate: newYear.endDate,
          status: newYear.status,
        });
      } else {
        await addFinancialYear({
          year: newYear.name,
          startDate: newYear.startDate,
          endDate: newYear.endDate,
          status: newYear.status,
        });
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Operation failed.");
    }
  };

  const handleSetCurrent = async (id) => {
    await updateFinancialYear({ id, status: true });
    fetchFinancialYears();
  };

  return (
    <motion.div
      className="min-h-screen p-5 font-dm bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white mb-10 ml-4" variants={itemVariants}>
        Financial Year Manager
      </motion.h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add / Edit Form */}
        <motion.div
          className="lg:col-span-1 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            {editingId ? "Update Financial Year" : "Add Financial Year"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-700 dark:text-gray-300 font-medium">Name</label>
              <input
                type="text"
                value={newYear.name}
                onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
                placeholder="e.g. 2024-25"
                className="w-full p-3 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 dark:text-gray-300 font-medium">Start Date</label>
              <input
                type="date"
                value={newYear.startDate}
                onChange={(e) => setNewYear({ ...newYear, startDate: e.target.value })}
                className="w-full p-3 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 dark:text-gray-300 font-medium">End Date</label>
              <input
                type="date"
                value={newYear.endDate}
                onChange={(e) => setNewYear({ ...newYear, endDate: e.target.value })}
                className="w-full p-3 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              />
            </div>

            <div className="flex gap-4 items-center">
              <span className="text-gray-800 dark:text-gray-300 font-medium">Is Current?</span>

              <label className="flex gap-1 items-center">
                <input
                  type="radio"
                  checked={!newYear.status}
                  onChange={() => setNewYear({ ...newYear, status: false })}
                />
                No
              </label>

              <label className="flex gap-1 items-center">
                <input
                  type="radio"
                  checked={newYear.status}
                  onChange={() => setNewYear({ ...newYear, status: true })}
                />
                Yes
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700">
                Reset
              </button>

              <button type="submit" className="flex items-center px-4 py-2 rounded-lg bg-blue-950 text-white">
                <FiPlus className="mr-1" />
                {editingId ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Existing Years */}
        <motion.div
          className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-blue-950 dark:text-white">
            Existing Financial Years ({financialYears.length})
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading...</p>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {financialYears.map((fy) => (
                  <motion.div
                    key={fy.id}
                    className={`flex justify-between items-center p-4 rounded-xl shadow-md border-2 ${
                      fy.status
                        ? "border-green-600 bg-green-50 dark:bg-gray-700"
                        : "border-blue-600 bg-white dark:bg-gray-800"
                    }`}
                    variants={itemVariants}
                  >
                    <div>
                      <div className="flex items-center text-lg font-semibold">
                        <FiCalendar className="mr-2 text-blue-600" />
                        {fy.year}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{fy.startDate} → {fy.endDate}</div>

                      {fy.status && (
                        <div className="text-green-600 text-sm mt-1 flex items-center">
                          <FiCheckCircle className="mr-1" /> Current
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!fy.status && (
                        <button onClick={() => handleSetCurrent(fy.id)} className="p-2 rounded-full text-green-600">
                          <FiCheckCircle size={18} />
                        </button>
                      )}

                      <button onClick={() => handleEdit(fy)} className="p-2 rounded-full text-blue-600">
                        <FiEdit size={18} />
                      </button>

                      <button onClick={() => deleteFinancialYear(fy.id)} className="p-2 rounded-full text-red-600">
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

export default FinancialYearManager;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import useLeaveStatusActions from "../../../../hooks/HR/LeaveConfig/useLeaveStatus";

const LeaveStatusSetup = () => {
  const {
    leaveStatuses,
    loading,
    saveOrUpdateLeaveStatus,
    getLeaveStatus,
    deleteLeaveStatus,
  } = useLeaveStatusActions();

  const [form, setForm] = useState({
    id: null,
    name: "",
    initialStatus: "",
  });

  const resetForm = () => {
    setForm({ id: null, name: "", initialStatus: "" });
  };

  // Handle Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.initialStatus) return;

    try {
      await saveOrUpdateLeaveStatus({
        id: form.id,
        name: form.name.trim(),
        initialStatus: form.initialStatus === "Yes",
      });
      resetForm();
    } catch (err) {
      console.error("Error saving leave status:", err);
    }
  };

  // Edit handler
  const handleEdit = async (id) => {
    try {
      const data = await getLeaveStatus(id);
      setForm({
        id: data.id,
        name: data.name,
        initialStatus: data.initialStatus ? "Yes" : "No",
      });
    } catch (err) {
      console.error("Error fetching leave status:", err);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this status?")) return;

    try {
      await deleteLeaveStatus(id);
    } catch (err) {
      console.error("Error deleting leave status:", err);
    }
  };

  const getInitialStatusStyle = (value) => {
    return value === "Yes"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <motion.div
      className="min-h-screen font-dm p-5 bg-gray-50 dark:bg-gray-900 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10">
        Leave Status Setup
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <motion.div className="lg:col-span-2 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Configure Leave Status
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Leave Status Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Pending, Approved, Cancelled"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Is Initial Status? (Default) <span className="text-red-600">*</span>
              </label>
              <select
                value={form.initialStatus}
                onChange={(e) =>
                  setForm({ ...form, initialStatus: e.target.value })
                }
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="" disabled>
                  --- Select Initial Status ---
                </option>
                <option value="Yes">Yes (Default when a leave is applied)</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
              >
                Reset
              </button>
              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> {form.id ? "Update Status" : "Add Status"}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Table */}
        <motion.div className="lg:col-span-3 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Leave Statuses ({leaveStatuses.length})
          </h2>

          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : leaveStatuses.length === 0 ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              No leave status added yet. Use the form on the left.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-gray-900 dark:text-white rounded-lg overflow-hidden min-w-[500px]">
                <thead>
                  <tr className="bg-blue-950 text-white dark:bg-gray-700">
                    <th className="p-3 text-left text-sm font-semibold border-b border-gray-200 dark:border-gray-600 w-16">
                      Sr.No
                    </th>
                    <th className="p-3 text-left text-sm font-semibold border-b border-gray-200 dark:border-gray-600">
                      Leave Status
                    </th>
                    <th className="p-3 text-center text-sm font-semibold border-b border-gray-200 dark:border-gray-600">
                      Initial Status
                    </th>
                    <th className="p-3 text-center text-sm font-semibold border-b border-gray-200 dark:border-gray-600 w-24">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {leaveStatuses.map((s, i) => (
                      <motion.tr
                        key={s.id}
                        className={`border-b border-gray-200 dark:border-gray-700 ${
                          i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
                        } hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="p-3 text-sm">{i + 1}</td>
                        <td className="p-3 text-sm font-medium text-blue-800 dark:text-blue-300">
                          {s.name}
                        </td>
                        <td className="p-3 text-center text-sm">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getInitialStatusStyle(
                              s.initialStatus ? "Yes" : "No"
                            )}`}
                          >
                            {s.initialStatus ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="p-3 text-center text-sm">
                          <motion.button
                            onClick={() => handleEdit(s.id)}
                            title="Edit"
                            className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full mr-2"
                            whileTap={{ scale: 0.8 }}
                          >
                            <FiEdit size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(s.id)}
                            title="Delete"
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full"
                            whileTap={{ scale: 0.8 }}
                          >
                            <FiTrash2 size={16} />
                          </motion.button>
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

export default LeaveStatusSetup;

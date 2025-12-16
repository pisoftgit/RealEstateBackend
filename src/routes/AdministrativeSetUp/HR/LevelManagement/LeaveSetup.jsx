import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import useLeaveTypesActions from "../../../../hooks/HR/LeaveConfig/LeaveType";
import useUserCategories from "../../../../hooks/General/useUserCategory";

const genders = ["ALL", "MALE", "FEMALE"];

const LeaveSetup = () => {
  const { leaveTypes, loading, saveLeaveType, updateLeaveType, deleteLeaveType } =
    useLeaveTypesActions();
  const { categories } = useUserCategories();

  const [form, setForm] = useState({
    leaveName: "",
    usersCategoryId: "",
    leavesEncashment: "NO",
    gender: "ALL",
    leaveCarriedForward: "NO",
  });

  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const resetForm = () => {
    setForm({
      leaveName: "",
      usersCategoryId: "",
      leavesEncashment: "NO",
      gender: "ALL",
      leaveCarriedForward: "NO",
    });
  };

  /** ADD */
  const handleAddLeave = async (e) => {
    e.preventDefault();
    try {
      await saveLeaveType(form);
      resetForm();
    } catch (err) {
      console.error("Failed to add leave type:", err);
    }
  };

  /** UPDATE */
  const handleUpdateLeave = async (e) => {
    e.preventDefault();
    if (!editModal) return;

    try {
      await updateLeaveType(editModal.id, form);
      resetForm();
      setEditModal(null);
    } catch (err) {
      console.error("Failed to update leave type:", err);
    }
  };

  /** DELETE */
  const handleDeleteLeave = async () => {
    if (!deleteModal) return;
    try {
      await deleteLeaveType(deleteModal.id);
      setDeleteModal(null);
    } catch (err) {
      console.error("Failed to delete leave type:", err);
    }
  };

  /** Autofill form when editing */
  useEffect(() => {
    if (editModal) {
      setForm({
        leaveName: editModal.leaveName,
        usersCategoryId: editModal.usersCategoryId,
        leavesEncashment: editModal.leavesEncashment,
        gender: editModal.gender,
        leaveCarriedForward: editModal.leaveCarriedForward,
      });
    }
  }, [editModal]);

  const yesNoRadio = (name, value, setter) => (
    <div className="flex gap-4">
      {["YES", "NO"].map((opt) => (
        <label key={opt} className="flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => setter(opt)}
          />
          {opt}
        </label>
      ))}
    </div>
  );

  return (
    <motion.div className="min-h-screen font-dm p-5 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10">
        Leave Setup
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* FORM */}
        <motion.div className="lg:col-span-2 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            {editModal ? "Edit Leave Type" : "Configure Leave Type"}
          </h2>

          <form
            onSubmit={editModal ? handleUpdateLeave : handleAddLeave}
            className="space-y-5"
          >
            {/* Leave Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Leave Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={form.leaveName}
                onChange={(e) => setForm({ ...form, leaveName: e.target.value })}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              />
            </div>

            {/* User Category */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Leave For (User Type)
              </label>
              <select
                value={form.usersCategoryId}
                onChange={(e) => setForm({ ...form, usersCategoryId: e.target.value })}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              >
                <option value="">--- Select User Category ---</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Encashment */}
            <div>
              <label className="block mb-2">Leaves Encashment</label>
              {yesNoRadio("leavesEncashment", form.leavesEncashment, (val) =>
                setForm({ ...form, leavesEncashment: val })
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block mb-2">Gender Restriction</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full p-3 border rounded-lg"
              >
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Carried Forward */}
            <div>
              <label className="block mb-2">Leave Carried Forward</label>
              {yesNoRadio("leaveCarriedForward", form.leaveCarriedForward, (val) =>
                setForm({ ...form, leaveCarriedForward: val })
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setEditModal(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Reset
              </button>

              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-950 text-white rounded-lg"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" />
                {editModal ? "Update" : "Add"} Leave
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* TABLE */}
        <motion.div className="lg:col-span-3 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-2xl font-bold mb-6">Existing Leave Types ({leaveTypes.length})</h2>

          {leaveTypes.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-950 text-white">
                  <th className="p-3">Leave Name</th>
                  <th className="p-3">Encashment</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Carried Fwd</th>
                  <th className="p-3">Manage</th>
                </tr>
              </thead>
              <tbody>
                {leaveTypes.map((leave) => (
                  <tr key={leave.id} className="border-b">
                    <td className="p-3">{leave.leaveName}</td>
                    <td className="p-3">{leave.leavesEncashment}</td>
                    <td className="p-3">{leave.gender}</td>
                    <td className="p-3">{leave.leaveCarriedForward}</td>
                    <td className="p-3 flex gap-3 justify-center">
                      <button onClick={() => setEditModal(leave)} className="text-blue-600">
                        <FiEdit />
                      </button>
                      <button onClick={() => setDeleteModal(leave)} className="text-red-600">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No leave types found.</p>
          )}
        </motion.div>
      </div>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
              <p>Are you sure you want to delete "{deleteModal.leaveName}"?</p>

              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setDeleteModal(null)} className="px-4 py-2 bg-gray-200">
                  Cancel
                </button>
                <button onClick={handleDeleteLeave} className="px-4 py-2 bg-red-600 text-white">
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LeaveSetup;

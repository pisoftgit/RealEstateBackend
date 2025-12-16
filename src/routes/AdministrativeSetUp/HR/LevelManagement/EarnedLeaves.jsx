import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

import useEarnedLeavesActions from "../../../../hooks/HR/LeaveConfig/EarnedLeaves";
import useDesignationActions from "../../../../hooks/HR/GeneralSetup/UseDesignation";
import useEmployeeTypeActions from "../../../../hooks/HR/GeneralSetup/useEmployeeType";

const EarnedLeaveSetup = () => {
  const {
    earnedLeaves,
    loading: earnedLoading,
    saveOrUpdateEarnedLeave,
    deleteEarnedLeave,
    getEarnedLeave,
  } = useEarnedLeavesActions();

  const {
    designations,
    loading: designationLoading,
  } = useDesignationActions();

  // Employee Types List
  const {
    employeeTypes,
    loading: employeeTypeLoading,
  } = useEmployeeTypeActions();

  // --------------------------
  // FORM STATE
  // --------------------------
  const [form, setForm] = useState({
    id: null,
    designationId: "",
    employeeTypeId: "",
    eligibilityAfterDays: "",
    workingDays: "",
    numberOfLeaves: "",
  });

  const resetForm = () => {
    setForm({
      id: null,
      designationId: "",
      employeeTypeId: "",
      eligibilityAfterDays: "",
      workingDays: "",
      numberOfLeaves: "",
    });
  };

  // --------------------------
  // ADD / UPDATE HANDLER
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await saveOrUpdateEarnedLeave({
        id: form.id ? Number(form.id) : null,
        designationId: Number(form.designationId),
        employeeTypeId: Number(form.employeeTypeId),
        eligibilityAfterDays: Number(form.eligibilityAfterDays),
        workingDays: Number(form.workingDays),
        numberOfLeaves: Number(form.numberOfLeaves),
      });

      resetForm();
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  // --------------------------
  // DELETE HANDLER
  // --------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;

    try {
      await deleteEarnedLeave(id);
    } catch (err) {
      console.error(err);
    }
  };

  // --------------------------
  // EDIT HANDLER
  // --------------------------
  const handleEdit = async (id) => {
    try {
      const res = await getEarnedLeave(id);
      const data = res?.data || res;

      setForm({
        id: data.id,
        designationId: data.designationId,
        employeeTypeId: data.employeeTypeId,
        eligibilityAfterDays: data.eligibilityAfterDays,
        workingDays: data.workingDays,
        numberOfLeaves: data.numberOfLeaves,
      });
    } catch (err) {
      console.error("Failed to load record:", err);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 font-dm bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10">
        Earned Leave Setup
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* -------------------- FORM -------------------- */}
        <motion.div className="lg:col-span-2 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">
            {form.id ? "Edit Earned Leave Policy" : "Add Earned Leave Policy"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Designation Dropdown */}
            <div>
              <label className="block mb-2">Designation <span className="text-red-600">*</span></label>
              <select
                value={form.designationId}
                onChange={(e) =>
                  setForm({ ...form, designationId: e.target.value })
                }
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              >
                <option value="">--- Select Designation ---</option>

                {!designationLoading &&
                  designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Employee Type Dropdown */}
            <div>
              <label className="block mb-2">Employee Type <span className="text-red-600">*</span></label>
              <select
                value={form.employeeTypeId}
                onChange={(e) =>
                  setForm({ ...form, employeeTypeId: e.target.value })
                }
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              >
                <option value="">--- Select Employee Type ---</option>

                {!employeeTypeLoading &&
                  employeeTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Eligibility After Days */}
            <div>
              <label className="block mb-2">Eligibility After Days</label>
              <input
                type="number"
                value={form.eligibilityAfterDays}
                onChange={(e) =>
                  setForm({ ...form, eligibilityAfterDays: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            {/* Working Days */}
            <div>
              <label className="block mb-2">Working Days</label>
              <input
                type="number"
                value={form.workingDays}
                onChange={(e) =>
                  setForm({ ...form, workingDays: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            {/* Number of Leaves */}
            <div>
              <label className="block mb-2">Number of Leaves</label>
              <input
                type="number"
                value={form.numberOfLeaves}
                onChange={(e) =>
                  setForm({ ...form, numberOfLeaves: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Reset
              </button>

              <motion.button
                type="submit"
                className="px-4 py-2 bg-blue-950 text-white rounded-lg flex items-center"
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus className="mr-2" />
                {form.id ? "Update" : "Add"}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* -------------------- TABLE -------------------- */}
        <motion.div className="lg:col-span-3 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">
            Existing Earned Leave Policies ({earnedLeaves.length})
          </h2>

          {earnedLoading ? (
            <p className="text-center py-10">Loading...</p>
          ) : earnedLeaves.length === 0 ? (
            <p className="text-center py-10">No policies found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-950 text-white">
                  <th className="p-3">Designation</th>
                  <th className="p-3">Employee Type</th>
                  <th className="p-3">Eligibility</th>
                  <th className="p-3">Working</th>
                  <th className="p-3">Leaves</th>
                  <th className="p-3 text-center">Manage</th>
                </tr>
              </thead>

              <tbody>
                {earnedLeaves.map((el) => (
                  <tr key={el.id} className="border-b">
                    <td className="p-3">
                      {
                        designations.find((d) => d.id === el.designationId)
                          ?.name || "—"
                      }
                    </td>

                    <td className="p-3">
                      {
                        employeeTypes.find((t) => t.id == el.employeeTypeId)
                          ?.name || "—"
                      }
                    </td>

                    <td className="p-3">{el.eligibilityAfterDays}</td>
                    <td className="p-3">{el.workingDays}</td>
                    <td className="p-3">{el.numberOfLeaves}</td>

                    <td className="p-3 text-center flex gap-3 justify-center">
                      <button
                        className="text-blue-600"
                        onClick={() => handleEdit(el.id)}
                      >
                        <FiEdit />
                      </button>

                      <button
                        className="text-red-600"
                        onClick={() => handleDelete(el.id)}
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
    </motion.div>
  );
};

export default EarnedLeaveSetup;

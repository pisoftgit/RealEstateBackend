import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiEdit, FiPlusCircle, FiPlus } from "react-icons/fi";
import useLeaveApprovalHierarchy from "../../../../hooks/HR/LeaveConfig/useLeaveHierarchy";
import useLevelsConfigActions from "../../../../hooks/HR/Hierarchy/useLevel";
import useDepartmentAPI from "../../../../hooks/HR/GeneralSetup/useDepartment";
import axios from "axios";
import { backendUrl } from "../../../../ProtectedRoutes/api";

const secret_key = localStorage.getItem("authToken");
const User = JSON.parse(localStorage.getItem("userData") || "{}");
const branchId = User?.branch?.id;

const LeaveApprovalHierarchy = () => {
  const { hierarchies, loading, deleteHierarchy, updateHierarchy, approveLeave } =
    useLeaveApprovalHierarchy();

  const { levels } = useLevelsConfigActions();
  const { departments } = useDepartmentAPI();

  const [formData, setFormData] = useState({
    id: null,
    levelId: "",
    departmentId: "",
    designationId: "",
    employeeId: "",
    powers: [""],
  });

  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [powers, setPowers] = useState([]);

  const [editMode, setEditMode] = useState(false);

  /** ---------------------------------
   * Fetch Designations
   * ----------------------------------*/
  const fetchDesignations = async (departmentId) => {
    if (!departmentId) return setDesignations([]);
    try {
      const res = await axios.get(
        `${backendUrl}/designation/by-department/${departmentId}`,
        { headers: { secret_key } }
      );
      setDesignations(res.data || []);
    } catch (err) {
      console.error("Designation Error:", err);
    }
  };

  /** ---------------------------------
   * Fetch Employees
   * ----------------------------------*/
  const fetchEmployees = async (designationId) => {
    if (!designationId) return setEmployees([]);
    try {
      const res = await axios.get(
        `${backendUrl}/leave-approval-hierarchy/employees/${designationId}/${branchId}`,
        { headers: { secret_key } }
      );
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Employee Error:", err);
    }
  };

  /** ---------------------------------
   * Fetch Powers
   * ----------------------------------*/
  const fetchPowers = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/leave-approval-hierarchy/getLeaveApprovalHierarchyRoles`,
        { headers: { secret_key } }
      );
      setPowers(Object.values(res.data) || []);
    } catch (err) {
      console.error("Power Error:", err);
    }
  };

  useEffect(() => {
    fetchPowers();
  }, []);

  /** ---------------------------------
   * Handle Input Change
   * ----------------------------------*/
  const handleInputChange = (e, index = null) => {
    let { name, value } = e.target;

    if (name === "powers") {
      const updated = [...formData.powers];
      updated[index] = value;
      setFormData({ ...formData, powers: updated });
      return;
    }

    setFormData({ ...formData, [name]: value });

    if (name === "departmentId") {
      fetchDesignations(value);
      setFormData((prev) => ({
        ...prev,
        designationId: "",
        employeeId: "",
      }));
      setEmployees([]);
    }

    if (name === "designationId") {
      fetchEmployees(value);
      setFormData((prev) => ({ ...prev, employeeId: "" }));
    }
  };

  /** ---------------------------------
   * Add Power Field
   * ----------------------------------*/
  const addPowerField = () => {
    if (formData.powers.length < 3) {
      setFormData({ ...formData, powers: [...formData.powers, ""] });
    }
  };

  /** ---------------------------------
   * Remove Power Field
   * ----------------------------------*/
  const removePowerField = (index) => {
    const updated = formData.powers.filter((_, i) => i !== index);
    setFormData({ ...formData, powers: updated });
  };

  /** ---------------------------------
   * Submit Form (POST or PUT)
   * ----------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      leaveApprovalConfigId: formData.levelId,
      employeeId: formData.employeeId,
      roles: formData.powers.map((p) => ({ role: p })), // FIXED
    };

    try {
      if (editMode) {
        await updateHierarchy({
          id: formData.id,
          ...payload,
        });
        alert("Hierarchy Updated!");
      } else {
        await approveLeave(payload);
        alert("Hierarchy Added!");
      }

      resetForm();
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Failed to save!");
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setFormData({
      id: null,
      levelId: "",
      departmentId: "",
      designationId: "",
      employeeId: "",
      powers: [""],
    });
    setDesignations([]);
    setEmployees([]);
  };

  const handleEdit = async (row) => {
    setEditMode(true);

    const departmentId = row.emp?.designation?.department?.id;
    const designationId = row.emp?.designation?.id;

    await fetchDesignations(departmentId);
    await fetchEmployees(designationId);

    setFormData({
      id: row.id,
      levelId: row.leaveApprovalConfig?.id || "",
      departmentId,
      designationId,
      employeeId: row.emp?.id || "",
      powers: row.leaveApprovalHierarchyRoles?.map((r) => r.role) || [""],
    });
  };

  return (
    <motion.div className="min-h-screen font-dm p-5 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10">
        Leave Approval Hierarchy Setup
      </h1>

      {/* FORM */}
      <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">
          {editMode ? "Edit Approval Hierarchy" : "Configure Approval Hierarchy"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* LEVEL */}
          <div>
            <label>Level *</label>
            <select
              name="levelId"
              value={formData.levelId}
              onChange={handleInputChange}
              className="w-full p-3 border rounded"
            >
              <option value="">--- Select Level ---</option>
              {levels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.levelName}
                </option>
              ))}
            </select>
          </div>

          {/* DEPARTMENT */}
          <div>
            <label>Department *</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              className="w-full p-3 border rounded"
            >
              <option value="">--- Select Department ---</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.department}
                </option>
              ))}
            </select>
          </div>

          {/* DESIGNATION */}
          <div>
            <label>Designation *</label>
            <select
              name="designationId"
              value={formData.designationId}
              onChange={handleInputChange}
              className="w-full p-3 border rounded"
            >
              <option value="">--- Select Designation ---</option>
              {designations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* EMPLOYEE */}
          <div>
            <label>Employee *</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              className="w-full p-3 border rounded"
            >
              <option value="">--- Select Employee ---</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {/* POWERS */}
          <div className="col-span-5">
            <label>Approver Powers *</label>
            {formData.powers.map((power, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <select
                  name="powers"
                  value={power}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-3 border rounded"
                >
                  <option value="">--- Select Power ---</option>
                  {powers
                    .filter((p) => p === power || !formData.powers.includes(p))
                    .map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                </select>

                {formData.powers.length < 3 && (
                  <button
                    type="button"
                    className="p-2 bg-blue-600 text-white rounded"
                    onClick={addPowerField}
                  >
                    <FiPlusCircle />
                  </button>
                )}

                {formData.powers.length > 1 && (
                  <button
                    type="button"
                    className="p-2 bg-red-600 text-white rounded"
                    onClick={() => removePowerField(index)}
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <div className="col-span-5 flex gap-3 pt-3">
            <button className="px-4 py-2 bg-blue-950 text-white rounded flex items-center">
              <FiPlus className="mr-2" /> {editMode ? "Update Hierarchy" : "Add Hierarchy"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Reset
            </button>
          </div>
        </form>
      </motion.div>

      {/* TABLE */}
      <motion.div className="mt-10 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">
          Existing Leave Approval Hierarchy
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Sr</th>
                  <th className="p-3 border">Department</th>
                  <th className="p-3 border">Level</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Approved</th>
                  <th className="p-3 border">Higher Authority</th>
                  <th className="p-3 border">Rejected</th>
                  <th className="p-3 border">Manage</th>
                </tr>
              </thead>

              <tbody>
                {hierarchies.map((row, index) => {
                  const roles = row.leaveApprovalHierarchyRoles?.map((r) => r.role) || [];

                  return (
                    <tr key={row.id} className="text-center">
                      <td className="p-3 border">{index + 1}</td>
                      <td className="p-3 border">{row.emp.designation.department.department}</td>
                      <td className="p-3 border">{row.leaveApprovalConfig.levelName}</td>
                      <td className="p-3 border">{row.emp.name}</td>

                      <td className="p-3 border">{roles.includes("Approved") ? "Yes" : "No"}</td>
                      <td className="p-3 border">
                        {roles.includes("Send To Higher Authority") ? "Yes" : "No"}
                      </td>
                      <td className="p-3 border">
                        {roles.includes("Rejected Request") ? "Yes" : "No"}
                      </td>

                      <td className="p-3 border flex justify-center gap-2">
                        <button
                          className="p-2 bg-blue-600 text-white rounded"
                          onClick={() => handleEdit(row)}
                        >
                          <FiEdit />
                        </button>

                        <button
                          className="p-2 bg-red-600 text-white rounded"
                          onClick={() => deleteHierarchy(row.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LeaveApprovalHierarchy;

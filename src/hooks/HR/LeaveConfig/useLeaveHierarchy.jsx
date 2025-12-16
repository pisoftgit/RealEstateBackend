import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useLeaveApprovalHierarchy = () => {
  const [hierarchies, setHierarchies] = useState([]);
  const [loading, setLoading] = useState(true);

  const secret_key = localStorage.getItem("authToken");

  
  const fetchAllHierarchies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/leave-approval-hierarchy/`, {
        headers: { secret_key },
      });
      setHierarchies(res.data || []);
    } catch (err) {
      console.error("Error fetching hierarchies:", err?.response?.data || err.message);
      setHierarchies([]);
    } finally {
      setLoading(false);
    }
  }, [secret_key]);

  /** -------------------------------
   * Get One Hierarchy by ID
   * --------------------------------
   */
  const getHierarchy = useCallback(
    async (id) => {
      try {
        const res = await axios.get(`${backendUrl}/leave-approval-hierarchy/${id}`, {
          headers: { secret_key },
        });
        return res.data;
      } catch (err) {
        console.error("Error fetching hierarchy:", err?.response?.data || err.message);
        throw err;
      }
    },
    [secret_key]
  );

  /** -------------------------------
   * Approve Leave / Create Hierarchy
   * --------------------------------
   */
  const approveLeave = useCallback(
    async ({ leaveApprovalConfigId, employeeId, roles }) => {
      try {
        const payload = { leaveApprovalConfigId, employeeId, roles };
        const res = await axios.post(`${backendUrl}/leave-approval-hierarchy/`, payload, {
          headers: { "Content-Type": "application/json", secret_key },
        });
        await fetchAllHierarchies();
        return res.data;
      } catch (err) {
        console.error("Error approving leave:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchAllHierarchies, secret_key]
  );

  /** -------------------------------
   * Update Hierarchy
   * --------------------------------
   */
  const updateHierarchy = useCallback(
    async ({ id, leaveApprovalConfigId, employeeId, roles }) => {
      try {
        const payload = { leaveApprovalConfigId, employeeId, roles };
        const res = await axios.put(`${backendUrl}/leave-approval-hierarchy/${id}`, payload, {
          headers: { "Content-Type": "application/json", secret_key },
        });
        await fetchAllHierarchies();
        return res.data;
      } catch (err) {
        console.error("Error updating hierarchy:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchAllHierarchies, secret_key]
  );

  /** -------------------------------
   * Delete Hierarchy
   * --------------------------------
   */
  const deleteHierarchy = useCallback(
    async (id) => {
      try {
        const res = await axios.delete(`${backendUrl}/leave-approval-hierarchy/${id}`, {
          headers: { secret_key },
        });
        await fetchAllHierarchies();
        return res.data;
      } catch (err) {
        console.error("Error deleting hierarchy:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchAllHierarchies, secret_key]
  );

  /** -------------------------------
   * Get Leave Approval Hierarchy Roles
   * --------------------------------
   */
  const getHierarchyRoles = useCallback(
    async () => {
      try {
        const res = await axios.get(`${backendUrl}/leave-approval-hierarchy/getLeaveApprovalHierarchyRoles`, {
          headers: { secret_key },
        });
        return res.data;
      } catch (err) {
        console.error("Error fetching hierarchy roles:", err?.response?.data || err.message);
        throw err;
      }
    },
    [secret_key]
  );

  /** -------------------------------
   * Fetch on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchAllHierarchies();
  }, [fetchAllHierarchies]);

  return {
    hierarchies,
    loading,
    fetchAllHierarchies,
    getHierarchy,
    approveLeave,
    updateHierarchy,
    deleteHierarchy,
    getHierarchyRoles,
  };
};

export default useLeaveApprovalHierarchy;

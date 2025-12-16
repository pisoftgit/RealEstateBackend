import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useLeaveRulesActions = () => {
  const [leaveRules, setLeaveRules] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Leave Rules
   * --------------------------------
   */
  const fetchLeaveRules = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/leaveRules/getAllLeaveRules`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        setLeaveRules(data.map(item => ({
          id: item.id.toString(),
          leaveTypeId: item.leaveTypeId,
          designationId: item.designationId,
          employeeTypeId: item.employeeTypeId,
          maxLimitPerMonth: item.maxLimitPerMonth,
          maxLeavesPerMonth: item.maxLeavesPerMonth,
          maxLeavesPerYear: item.maxLeavesPerYear,
          leaveTypeCode: item.leaveTypeCode,
        })));
      } else {
        setLeaveRules([]);
      }
    } catch (err) {
      console.error("Error fetching leave rules:", err?.response?.data || err.message);
      setLeaveRules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Save / Update Leave Rule
   * --------------------------------
   */
  const saveOrUpdateLeaveRule = useCallback(
    async ({
      id,
      leaveTypeId,
      designationId,
      employeeTypeId,
      maxLimitPerMonth,
      maxLeavesPerMonth,
      maxLeavesPerYear,
      leaveTypeCode
    }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = {
          leaveTypeId,
          designationId,
          employeeTypeId,
          maxLimitPerMonth,
          maxLeavesPerMonth,
          maxLeavesPerYear,
          leaveTypeCode
        };

        const url = id
          ? `${backendUrl}/leaveRules/save` // API might handle update in save
          : `${backendUrl}/leaveRules/save`;

        const res = await axios.post(
          url,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchLeaveRules();
        return res.data;
      } catch (err) {
        console.error("Error saving/updating leave rule:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchLeaveRules]
  );

  /** -------------------------------
   *   Get One Leave Rule
   * --------------------------------
   */
  const getLeaveRule = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.get(
          `${backendUrl}/leaveRules/getLeaveRule/${id}`,
          { headers: { secret_key: secretKey } }
        );

        return res.data;
      } catch (err) {
        console.error("Error fetching leave rule:", err?.response?.data || err.message);
        throw err;
      }
    },
    []
  );

  /** -------------------------------
   *   Delete Leave Rule
   * --------------------------------
   */
  const deleteLeaveRule = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/leaveRules/delete/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchLeaveRules();
        return res.data;
      } catch (err) {
        console.error("Error deleting leave rule:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchLeaveRules]
  );

  /** -------------------------------
   *   Fetch on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchLeaveRules();
  }, [fetchLeaveRules]);

  return {
    leaveRules,
    loading,
    fetchLeaveRules,
    saveOrUpdateLeaveRule,
    getLeaveRule,
    deleteLeaveRule,
  };
};

export default useLeaveRulesActions;

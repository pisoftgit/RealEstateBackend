import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useLeaveTypesActions = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Leave Types
   * --------------------------------
   */
  const fetchLeaveTypes = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/leaveSetup/leaveTypes`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        setLeaveTypes(
          data.map((item) => ({
            id: Number(item.id),
            leaveName: item.leaveName || "N/A",
            usersCategoryId: item.usersCategory?.id || "",
            leavesEncashment: item.leavesEncashment || "NO",
            gender: item.gender || "ALL",
            leaveCarriedForward: item.leaveCarriedForward || "NO",
          }))
        );
      } else {
        setLeaveTypes([]);
      }
    } catch (err) {
      console.error("Error fetching leave types:", err?.response?.data || err.message);
      setLeaveTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Save Leave Type
   * --------------------------------
   */
  const saveLeaveType = useCallback(
    async ({ leaveName, usersCategoryId, leavesEncashment, gender, leaveCarriedForward }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = {
          leaveName,
          usersCategory: { id: Number(usersCategoryId) },
          leavesEncashment,
          gender,
          leaveCarriedForward,
        };

        const res = await axios.post(
          `${backendUrl}/leaveSetup/leaveTypes`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchLeaveTypes();
        return res.data;
      } catch (err) {
        console.error("Error saving leave type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchLeaveTypes]
  );

  /** -------------------------------
   *   Update Leave Type
   * --------------------------------
   */
  const updateLeaveType = useCallback(
    async (id, formData) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = {
          id:id,
          leaveName: formData.leaveName,
          usersCategory: { id: Number(formData.usersCategoryId) },
          leavesEncashment: formData.leavesEncashment,
          gender: formData.gender,
          leaveCarriedForward: formData.leaveCarriedForward,
        };

        const res = await axios.post(
          `${backendUrl}/leaveSetup/leaveTypes`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchLeaveTypes();
        return res.data;
      } catch (err) {
        console.error("Error updating leave type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchLeaveTypes]
  );

  /** -------------------------------
   *   Delete Leave Type
   * --------------------------------
   */
  const deleteLeaveType = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/leaveSetup/leaveTypes/${Number(id)}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchLeaveTypes();
        return res.data;
      } catch (err) {
        console.error("Error deleting leave type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchLeaveTypes]
  );

  useEffect(() => {
    fetchLeaveTypes();
  }, [fetchLeaveTypes]);

  return {
    leaveTypes,
    loading,
    fetchLeaveTypes,
    saveLeaveType,
    updateLeaveType,
    deleteLeaveType,
  };
};

export default useLeaveTypesActions;

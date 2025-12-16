import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useLeaveStatusActions = () => {
  const [leaveStatuses, setLeaveStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Leave Statuses
   * --------------------------------
   */
  const fetchLeaveStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}//leave-status/`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        setLeaveStatuses(data.map(item => ({
          id: item.id.toString(),
          name: item.name || "N/A",
          initialStatus: item.initialStatus || false,
        })));
      } else {
        setLeaveStatuses([]);
      }
    } catch (err) {
      console.error("Error fetching leave statuses:", err?.response?.data || err.message);
      setLeaveStatuses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Save / Update Leave Status
   * --------------------------------
   */
  const saveOrUpdateLeaveStatus = useCallback(
    async ({ id, name, initialStatus }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { name, initialStatus };
        const payload2 = {id, name, initialStatus}

        let res;

        if (id) {
          // Update existing leave status
          res = await axios.post(
            `${backendUrl}/leave-status`,
            payload2,
            { headers: { "Content-Type": "application/json", secret_key: secretKey } }
          );
        } else {
          // Create new leave status
          res = await axios.post(
            `${backendUrl}/leave-status`,
            payload,
            { headers: { "Content-Type": "application/json", secret_key: secretKey } }
          );
        }

        await fetchLeaveStatuses();
        return res.data;
      } catch (err) {
        console.error(
          "Error saving/updating leave status:",
          err?.response?.data || err.message
        );
        throw err;
      }
    },
    [fetchLeaveStatuses]
  );

  /** -------------------------------
   *   Get One Leave Status
   * --------------------------------
   */
  const getLeaveStatus = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.get(
          `${backendUrl}//leave-status/${id}`,
          { headers: { secret_key: secretKey } }
        );

        return res.data;
      } catch (err) {
        console.error("Error fetching leave status:", err?.response?.data || err.message);
        throw err;
      }
    },
    []
  );

  /** -------------------------------
   *   Delete Leave Status
   * --------------------------------
   */
  const deleteLeaveStatus = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}//leave-status/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchLeaveStatuses();
        return res.data;
      } catch (err) {
        console.error("Error deleting leave status:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchLeaveStatuses]
  );

  /** -------------------------------
   *   Fetch on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchLeaveStatuses();
  }, [fetchLeaveStatuses]);

  return {
    leaveStatuses,
    loading,
    fetchLeaveStatuses,
    saveOrUpdateLeaveStatus,
    getLeaveStatus,
    deleteLeaveStatus,
  };
};

export default useLeaveStatusActions;

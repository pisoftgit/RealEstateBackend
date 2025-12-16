import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useEarnedLeavesActions = () => {
  const [earnedLeaves, setEarnedLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Earned Leaves
   * --------------------------------
   */
  const fetchEarnedLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/earnLeave/`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        setEarnedLeaves(data.map(item => ({
          id: item.id.toString(),
          designationId: item.designationId,
          employeeTypeId: item.employeeTypeId,
          eligibilityAfterDays: item.eligibilityAfterDays,
          workingDays: item.workingDays,
          numberOfLeaves: item.numberOfLeaves,
        })));
      } else {
        setEarnedLeaves([]);
      }
    } catch (err) {
      console.error("Error fetching earned leaves:", err?.response?.data || err.message);
      setEarnedLeaves([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Save / Update Earned Leave
   * --------------------------------
   */
  const saveOrUpdateEarnedLeave = useCallback(
  async ({ id, designationId, employeeTypeId, eligibilityAfterDays, workingDays, numberOfLeaves }) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = { id,designationId, employeeTypeId, eligibilityAfterDays, workingDays, numberOfLeaves };

      let res;

      if (id) {
        res = await axios.post(
          `${backendUrl}/earnLeave/`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );
      } else {
        // Create new record
        res = await axios.post(
          `${backendUrl}/earnLeave/`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );
      }

      await fetchEarnedLeaves();
      return res.data;
    } catch (err) {
      console.error("Error saving/updating earned leave:", err?.response?.data || err.message);
      throw err;
    }
  },
  [fetchEarnedLeaves]
);


  /** -------------------------------
   *   Get One Earned Leave
   * --------------------------------
   */
  const getEarnedLeave = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.get(
          `${backendUrl}/earnLeave/${id}`,
          { headers: { secret_key: secretKey } }
        );

        return res.data;
      } catch (err) {
        console.error("Error fetching earned leave:", err?.response?.data || err.message);
        throw err;
      }
    },
    []
  );

  /** -------------------------------
   *   Delete Earned Leave
   * --------------------------------
   */
  const deleteEarnedLeave = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/earnLeave/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchEarnedLeaves();
        return res.data;
      } catch (err) {
        console.error("Error deleting earned leave:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchEarnedLeaves]
  );

  /** -------------------------------
   *   Fetch on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchEarnedLeaves();
  }, [fetchEarnedLeaves]);

  return {
    earnedLeaves,
    loading,
    fetchEarnedLeaves,
    saveOrUpdateEarnedLeave,
    getEarnedLeave,
    deleteEarnedLeave,
  };
};

export default useEarnedLeavesActions;

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useRelievingReasonActions = () => {
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Relieving Reasons
   * --------------------------------
   */
  const fetchReasons = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/reasonForRelieving/`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        setReasons(data.map(item => ({
          id: item.id.toString(),
          name: item.name || "N/A",
        })));
      } else {
        setReasons([]);
      }
    } catch (err) {
      console.error("Error fetching relieving reasons:", err?.response?.data || err.message);
      setReasons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Add Relieving Reason
   * --------------------------------
   */
  const addReason = useCallback(
    async (name) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { name };

        const res = await axios.post(
          `${backendUrl}/reasonForRelieving/`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchReasons();
        return res.data;
      } catch (err) {
        console.error("Error adding relieving reason:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchReasons]
  );

  /** -------------------------------
   *   Update Relieving Reason
   * --------------------------------
   */
  const updateReason = useCallback(
    async (id, name) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { name };

        const res = await axios.put(
          `${backendUrl}/reasonForRelieving/${id}`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchReasons();
        return res.data;
      } catch (err) {
        console.error("Error updating relieving reason:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchReasons]
  );

  /** -------------------------------
   *   Delete Relieving Reason
   * --------------------------------
   */
  const deleteReason = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/reasonForRelieving/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchReasons();
        return res.data;
      } catch (err) {
        console.error("Error deleting relieving reason:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchReasons]
  );

  /** -------------------------------
   *   Fetch on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchReasons();
  }, [fetchReasons]);

  return {
    reasons,
    loading,
    fetchReasons,
    addReason,
    updateReason,
    deleteReason,
  };
};

export default useRelievingReasonActions;

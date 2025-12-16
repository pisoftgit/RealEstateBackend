import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useLeaveApprovalConfigActions = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Leave Approval Configs
   * --------------------------------
   */
  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}//leave-approval-config/`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        setConfigs(data.map(item => ({
          id: item.id.toString(),
          levelName: item.levelName || "N/A",
        })));
      } else {
        setConfigs([]);
      }
    } catch (err) {
      console.error("Error fetching leave approval configs:", err?.response?.data || err.message);
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Add / Update Leave Approval Config
   * --------------------------------
   */
  const saveOrUpdateConfig = useCallback(
    async ({ id, levelName }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload1 = { levelName };
        const payload2 = { id, levelName };

        const payload = id ? payload2 : payload1

        const res = await axios.post(`${backendUrl}/leave-approval-config/`, payload ,
          {headers :{ secret_key : secretKey}}
        );

        await fetchConfigs();
        return res.data;
      } catch (err) {
        console.error("Error saving/updating leave approval config:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchConfigs]
  );

  /** -------------------------------
   *   Get One Config / Delete
   * --------------------------------
   */
  const getConfig = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.get(
          `${backendUrl}//leave-approval-config/${id}`,
          { headers: { secret_key: secretKey } }
        );

        return res.data;
      } catch (err) {
        console.error("Error fetching leave approval config:", err?.response?.data || err.message);
        throw err;
      }
    },
    []
  );

  const deleteConfig = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}//leave-approval-config/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchConfigs();
        return res.data;
      } catch (err) {
        console.error("Error deleting leave approval config:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchConfigs]
  );

  /** -------------------------------
   *   Fetch on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  return {
    configs,
    loading,
    fetchConfigs,
    saveOrUpdateConfig,
    getConfig,
    deleteConfig,
  };
};

export default useLeaveApprovalConfigActions;

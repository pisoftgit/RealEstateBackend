import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useDesignationLevelsActions = () => {
  const [designationLevels, setDesignationLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Designation Levels
   * --------------------------------
   */
  const fetchDesignationLevels = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/designation-levels/`, {
        headers: { secret_key: secretKey },
      });

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        // Map API response
        setDesignationLevels(
          data.map((item) => ({
            id: item.id.toString(),
            levelsConfig: {
              id: item.levelsConfig?.id,
              maximumLevels: item.levelsConfig?.maximumLevels || 0,
              levelName: item.levelsConfig?.levelName || "N/A",
            },
            designations: Array.isArray(item.designations)
              ? item.designations.map((d) => ({
                  id: d.id,
                  name: d.name,
                  department: d.department || {},
                }))
              : [],
          }))
        );
      } else {
        setDesignationLevels([]);
      }
    } catch (err) {
      console.error("Error fetching designation levels:", err?.response?.data || err.message);
      setDesignationLevels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Save Designation Levels
   * --------------------------------
   */
  const saveDesignationLevels = useCallback(
    async (levelsConfigId, designationIds) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { levelsConfigId, designationIds };

        const res = await axios.post(`${backendUrl}/designation-levels/`, payload, {
          headers: { "Content-Type": "application/json", secret_key: secretKey },
        });

        await fetchDesignationLevels();
        return res.data;
      } catch (err) {
        console.error("Error saving designation levels:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchDesignationLevels]
  );

  /** -------------------------------
   *   Update Designation Level
   * --------------------------------
   */
  const updateDesignationLevel = useCallback(
    async (id, levelsConfigId, designationIds) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { levelsConfigId, designationIds };

        const res = await axios.put(`${backendUrl}/designation-levels/${id}`, payload, {
          headers: { "Content-Type": "application/json", secret_key: secretKey },
        });

        await fetchDesignationLevels();
        return res.data;
      } catch (err) {
        console.error("Error updating designation level:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchDesignationLevels]
  );

  /** -------------------------------
   *   Delete Designation Level
   * --------------------------------
   */
  const deleteDesignationLevel = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(`${backendUrl}/designation-levels/${id}`, {
          headers: { secret_key: secretKey },
        });

        await fetchDesignationLevels();
        return res.data;
      } catch (err) {
        console.error("Error deleting designation level:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchDesignationLevels]
  );

  /** -------------------------------
   *   Fetch on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchDesignationLevels();
  }, [fetchDesignationLevels]);

  return {
    designationLevels,
    loading,
    fetchDesignationLevels,
    saveDesignationLevels,
    updateDesignationLevel,
    deleteDesignationLevel,
  };
};

export default useDesignationLevelsActions;

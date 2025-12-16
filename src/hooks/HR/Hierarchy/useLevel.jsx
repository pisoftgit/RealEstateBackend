import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useLevelsConfigActions = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Levels Configs
   * --------------------------------
   */
  const fetchLevels = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/levelsConfig/all`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        setLevels(data.map(item => ({
          id: item.id.toString(),
          levelName: item.levelName || "N/A",
          maximumLevels: item.maximumLevels || 0,
        })));
      } else {
        setLevels([]);
      }
    } catch (err) {
      console.error("Error fetching levels config:", err?.response?.data || err.message);
      setLevels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Add Level Config
   * --------------------------------
   */
  const addLevel = useCallback(
    async (levelName, maximumLevels) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { levelName, maximumLevels };

        const res = await axios.post(
          `${backendUrl}/levelsConfig/save`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchLevels();
        return res.data;
      } catch (err) {
        console.error("Error adding level config:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchLevels]
  );

  /** -------------------------------
   *   Update Level Config
   * --------------------------------
   */
  const updateLevel = useCallback(
    async (id, levelName, maximumLevels) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { levelName, maximumLevels };

        const res = await axios.put(
          `${backendUrl}/levelsConfig/${id}`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchLevels();
        return res.data;
      } catch (err) {
        console.error("Error updating level config:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchLevels]
  );

  /** -------------------------------
   *   Delete Level Config
   * --------------------------------
   */
  const deleteLevel = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/levelsConfig/delete/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchLevels();
        return res.data;
      } catch (err) {
        console.error("Error deleting level config:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchLevels]
  );

  /** -------------------------------
   *   Fetch on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  return {
    levels,
    loading,
    fetchLevels,
    addLevel,
    updateLevel,
    deleteLevel,
  };
};

export default useLevelsConfigActions;

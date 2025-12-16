import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useReligionActions = () => {
  const [religions, setReligions] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Religions
   * --------------------------------
   */
  const fetchReligions = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/religion/religions`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        setReligions(data.map(item => ({
          id: item.id.toString(),
          name: item.name || "N/A"
        })));
      } else {
        setReligions([]);
      }
    } catch (err) {
      console.error("Error fetching religions:", err?.response?.data || err.message);
      setReligions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Add New Religion
   * --------------------------------
   */
  const addReligion = useCallback(
    async (name) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { name };

        const res = await axios.post(
          `${backendUrl}/religion/addNewReligion`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchReligions();
        return res.data;
      } catch (err) {
        console.error("Error adding religion:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchReligions]
  );

  /** -------------------------------
   *   Update Religion
   * --------------------------------
   */
  const updateReligion = useCallback(
    async (id, name) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { name };

        const res = await axios.put(
          `${backendUrl}/religion/updateReligion/${id}`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchReligions();
        return res.data;
      } catch (err) {
        console.error("Error updating religion:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchReligions]
  );

  /** -------------------------------
   *   Delete Religion
   * --------------------------------
   */
  const deleteReligion = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/religion/delete/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchReligions();
        return res.data;
      } catch (err) {
        console.error("Error deleting religion:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchReligions]
  );

  /** -------------------------------
   *   Fetch Religions on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchReligions();
  }, [fetchReligions]);

  return {
    religions,
    loading,
    fetchReligions,
    addReligion,
    updateReligion,
    deleteReligion,
  };
};

export default useReligionActions;

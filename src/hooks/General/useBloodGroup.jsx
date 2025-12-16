import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useBloodGroupActions = () => {
  const [bloodGroups, setBloodGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Blood Groups
   * --------------------------------
   */
  const fetchBloodGroups = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/blood-groups/getAllBloodGroups`, {
        headers: { secret_key: secretKey },
      });

      const data = res.data?.data || res.data;
      setBloodGroups(data);
    } catch (err) {
      console.error("Error fetching blood groups:", err?.response?.data || err.message);
      setBloodGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Add Blood Group
   * --------------------------------
   */
  const addBloodGroup = useCallback(async (bloodGroup) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = { bloodGroup };
      const res = await axios.post(
        `${backendUrl}/blood-groups/save`,
        payload,
        {
          headers: { "Content-Type": "application/json", secret_key: secretKey },
        }
      );

      await fetchBloodGroups(); // Refresh blood group list after add
      return res.data;
    } catch (err) {
      console.error("Error adding blood group:", err?.response?.data || err.message);
      throw err;
    }
  }, [fetchBloodGroups]);

  /** -------------------------------
   *   Update Blood Group
   * --------------------------------
   */
  const updateBloodGroup = useCallback(async (id, bloodGroup) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = { bloodGroup };
      const res = await axios.put(
        `${backendUrl}/blood-groups/update/${id}`,
        payload,
        {
          headers: { "Content-Type": "application/json", secret_key: secretKey },
        }
      );

      await fetchBloodGroups(); // Refresh blood group list after update
      return res.data;
    } catch (err) {
      console.error("Error updating blood group:", err?.response?.data || err.message);
      throw err;
    }
  }, [fetchBloodGroups]);

  /** -------------------------------
   *   Delete Blood Group
   * --------------------------------
   */
  const deleteBloodGroup = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.delete(`${backendUrl}/blood-groups/delete/${id}`, {
        headers: { secret_key: secretKey },
      });

      await fetchBloodGroups(); // Refresh blood group list after delete
      return res.data;
    } catch (err) {
      console.error("Error deleting blood group:", err?.response?.data || err.message);
      throw err;
    }
  }, [fetchBloodGroups]);

  useEffect(() => {
    fetchBloodGroups();
  }, [fetchBloodGroups]);

  return {
    bloodGroups,
    loading,
    fetchBloodGroups,
    addBloodGroup,
    updateBloodGroup,
    deleteBloodGroup,
  };
};

export default useBloodGroupActions;

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useDesignationActions = () => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Designations
   * --------------------------------
   */
  const fetchDesignations = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/designation/all`, {
        headers: { secret_key: secretKey },
      });

      setDesignations(res.data);
    } catch (err) {
      console.error("Error fetching designations:", err?.response?.data || err.message);
      setDesignations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Add Designation
   * --------------------------------
   */
  const addDesignation = useCallback(async (departmentId, designationName) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = { departmentId, designationName };
      const res = await axios.post(
        `${backendUrl}/designation/add`,
        payload,
        {
          headers: { "Content-Type": "application/json", secret_key: secretKey },
        }
      );

      await fetchDesignations(); // Refresh list
      return res.data;
    } catch (err) {
      console.error("Error adding designation:", err?.response?.data || err.message);
      throw err;
    }
  }, [fetchDesignations]);

  /** -------------------------------
   *   Update Designation
   * --------------------------------
   */
  const updateDesignation = useCallback(async (id, departmentId, designationName) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = { departmentId, designationName };
      const res = await axios.put(
        `${backendUrl}/designation/update/${id}`,
        payload,
        {
          headers: { "Content-Type": "application/json", secret_key: secretKey },
        }
      );

      await fetchDesignations();
      return res.data;
    } catch (err) {
      console.error("Error updating designation:", err?.response?.data || err.message);
      throw err;
    }
  }, [fetchDesignations]);

  /** -------------------------------
   *   Delete Designation
   * --------------------------------
   */
  const deleteDesignation = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.delete(`${backendUrl}/designation/${id}`, {
        headers: { secret_key: secretKey },
      });

      await fetchDesignations();
      return res.data;
    } catch (err) {
      console.error("Error deleting designation:", err?.response?.data || err.message);
      throw err;
    }
  }, [fetchDesignations]);

  useEffect(() => {
    fetchDesignations();
  }, [fetchDesignations]);

  return {
    designations,
    loading,
    fetchDesignations,
    addDesignation,
    updateDesignation,
    deleteDesignation,
  };
};

export default useDesignationActions;

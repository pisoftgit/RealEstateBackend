import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useBranchActions = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** -------------------------------
   *   Fetch All Branches
   * --------------------------------
   */
  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/branch/all`,
        { headers: { secret_key: token } }
      );

      console.log("API RAW:", res.data);

      setBranches(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error("Error fetching branches:", err);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Add Branch (Supports FormData)
   * --------------------------------
   */
  const addBranch = useCallback(
    async (formData) => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Missing authentication token");

        const res = await axios.post(
          `${backendUrl}/branch/create`,
          formData,
          {
            headers: {
              secret_key: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        await fetchBranches(); // refresh list
        return res.data;
      } catch (err) {
        console.error("Error adding branch:", err);
        throw err;
      }
    },
    [fetchBranches]
  );

  /** -------------------------------
   *   Update Branch (Supports FormData)
   * --------------------------------
   */
  const updateBranch = useCallback(
    async (id, formData) => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Missing authentication token");

        const res = await axios.put(
          `${backendUrl}/branch/update/${id}`,
          formData,
          {
            headers: {
              secret_key: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        await fetchBranches();
        return res.data;
      } catch (err) {
        console.error("Error updating branch:", err);
        throw err;
      }
    },
    [fetchBranches]
  );

  /** -------------------------------
   *   Delete Branch
   * --------------------------------
   */
  const deleteBranch = useCallback(
    async (id) => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/branch/delete/${id}`,
          { headers: { secret_key: token } }
        );

        await fetchBranches();
        return res.data;
      } catch (err) {
        console.error("Error deleting branch:", err);
        throw err;
      }
    },
    [fetchBranches]
  );

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return {
    branches,
    loading,
    error,
    fetchBranches,
    addBranch,
    updateBranch,
    deleteBranch,
  };
};

export default useBranchActions;

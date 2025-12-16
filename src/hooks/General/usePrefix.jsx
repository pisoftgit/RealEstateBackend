import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api"; // Ensure backendUrl is defined

const usePrefix = () => {
  const [prefixes, setPrefixes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all prefixes
  const fetchPrefixes = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/prefix/getAllPrefix`, {
        headers: { secret_key: secretKey }
      });

      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setPrefixes(data);
      } else {
        setPrefixes([]);
      }
    } catch (err) {
      console.error("Error fetching prefixes:", err?.response?.data || err.message);
      setError("Failed to fetch prefixes");
      setPrefixes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new prefix
  const addPrefix = useCallback(async (prefixName) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = { prefixName };

      const res = await axios.post(
        `${backendUrl}/prefix/save`,
        payload,
        { headers: { "Content-Type": "application/json", secret_key: secretKey } }
      );

      setPrefixes([res.data, ...prefixes]);
    } catch (err) {
      console.error("Error adding prefix:", err?.response?.data || err.message);
      setError("Failed to add prefix");
    }
  }, [prefixes]);

  // Update existing prefix
  const updatePrefix = useCallback(async (id, newPrefix) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = { prefixName: newPrefix };

      const res = await axios.put(
        `${backendUrl}/prefix/update/${id}`,
        payload,
        { headers: { "Content-Type": "application/json", secret_key: secretKey } }
      );

      setPrefixes(
        prefixes.map((prefix) =>
          prefix.id === id ? { ...prefix, prefixName: newPrefix } : prefix
        )
      );
    } catch (err) {
      console.error("Error updating prefix:", err?.response?.data || err.message);
      setError("Failed to update prefix");
    }
  }, [prefixes]);

  // Delete a prefix
  const deletePrefix = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.delete(
        `${backendUrl}/prefix/delete/${id}`,
        { headers: { secret_key: secretKey } }
      );

      setPrefixes(prefixes.filter((prefix) => prefix.id !== id));
    } catch (err) {
      console.error("Error deleting prefix:", err?.response?.data || err.message);
      setError("Failed to delete prefix");
    }
  }, [prefixes]);

  // Fetch on mount
  useEffect(() => {
    fetchPrefixes();
  }, [fetchPrefixes]);

  return {
    prefixes,
    loading,
    error,
    addPrefix,
    updatePrefix,
    deletePrefix
  };
};

export default usePrefix;

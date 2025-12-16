import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useOwnershipTypes = () => {
  const [ownershipTypes, setOwnershipTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapOwnershipType = (item) => ({
    id: item.id?.toString(),
    type: item.type || "N/A",
  });

  // Fetch all ownership types
  const fetchOwnershipTypes = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/ownership-types/getAllOwnershipTypes`, {
        headers: { secret_key: secretKey },
      });

      const data = res.data?.data || res.data;
      setOwnershipTypes(Array.isArray(data) ? data.map(mapOwnershipType) : []);
    } catch (err) {
      console.error("Error fetching ownership types:", err?.response?.data || err.message);
      setOwnershipTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get ownership type by ID
  const getOwnershipTypeById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/ownership-types/getOwnershipTypeById/${id}`,
        { headers: { secret_key: secretKey } }
      );

      const item = res.data?.data || res.data;
      return mapOwnershipType(item);
    } catch (err) {
      console.error("Error fetching ownership type by ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // Add new ownership type
  const addOwnershipType = useCallback(
    async ({ type }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { type };

        const res = await axios.post(
          `${backendUrl}/ownership-types/saveOwnershipType`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchOwnershipTypes();
        return res.data;
      } catch (err) {
        console.error("Error adding ownership type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchOwnershipTypes]
  );

  // Update ownership type
  const updateOwnershipType = useCallback(
    async ({ id, type }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { type };

        const res = await axios.put(
          `${backendUrl}/ownership-types/updateOwnershipType/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchOwnershipTypes();
        return res.data;
      } catch (err) {
        console.error("Error updating ownership type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchOwnershipTypes]
  );

  // Delete ownership type
  const deleteOwnershipType = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/ownership-types/deleteOwnershipType/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchOwnershipTypes();
        return res.data;
      } catch (err) {
        console.error("Error deleting ownership type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchOwnershipTypes]
  );

  useEffect(() => {
    fetchOwnershipTypes();
  }, [fetchOwnershipTypes]);

  return {
    ownershipTypes,
    loading,
    fetchOwnershipTypes,
    getOwnershipTypeById,
    addOwnershipType,
    updateOwnershipType,
    deleteOwnershipType,
  };
};

export default useOwnershipTypes;

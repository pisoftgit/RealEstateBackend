import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useParkingTypes = () => {
  const [parkingTypes, setParkingTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapParkingType = (item) => ({
    id: item.id?.toString(),
    type: item.type || "N/A",
  });

  // Fetch all parking types
  const fetchParkingTypes = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/parking-types/getAllParkingTypes`, {
        headers: { secret_key: secretKey },
      });

      const data = res.data?.data || res.data;
      setParkingTypes(Array.isArray(data) ? data.map(mapParkingType) : []);
    } catch (err) {
      console.error("Error fetching parking types:", err?.response?.data || err.message);
      setParkingTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get parking type by ID
  const getParkingTypeById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/parking-types/getParkingTypeById/${id}`, {
        headers: { secret_key: secretKey },
      });

      const item = res.data?.data || res.data;
      return mapParkingType(item);
    } catch (err) {
      console.error("Error fetching parking type by ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // Add new parking type
  const addParkingType = useCallback(
    async ({ type }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { type };

        const res = await axios.post(
          `${backendUrl}/parking-types/saveParkingType`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchParkingTypes();
        return res.data;
      } catch (err) {
        console.error("Error adding parking type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchParkingTypes]
  );

  // Update parking type
  const updateParkingType = useCallback(
    async ({ id, type }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { type };

        const res = await axios.put(
          `${backendUrl}/parking-types/updateParkingType/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchParkingTypes();
        return res.data;
      } catch (err) {
        console.error("Error updating parking type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchParkingTypes]
  );

  // Delete parking type
  const deleteParkingType = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/parking-types/deleteParkingType/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchParkingTypes();
        return res.data;
      } catch (err) {
        console.error("Error deleting parking type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchParkingTypes]
  );

  useEffect(() => {
    fetchParkingTypes();
  }, [fetchParkingTypes]);

  return {
    parkingTypes,
    loading,
    fetchParkingTypes,
    getParkingTypeById,
    addParkingType,
    updateParkingType,
    deleteParkingType,
  };
};

export default useParkingTypes;

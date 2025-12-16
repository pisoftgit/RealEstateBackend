import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useFurnishingStatuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapStatus = (item) => ({
    id: item.id?.toString(),
    status: item.status || "N/A",
  });

  // FETCH ALL STATUSES
  const fetchStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/furnishing-statuses/getAllFurnishingStatuses`, {
        headers: { secret_key: secretKey },
      });

      const data = res.data?.data || res.data;
      setStatuses(Array.isArray(data) ? data.map(mapStatus) : []);
    } catch (err) {
      console.error("Error fetching furnishing statuses:", err?.response?.data || err.message);
      setStatuses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET STATUS BY ID
  const getStatusById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/furnishing-statuses/getFurnishingStatusById/${id}`, {
        headers: { secret_key: secretKey },
      });

      const item = res.data?.data || res.data;
      return mapStatus(item);
    } catch (err) {
      console.error("Error fetching furnishing status by ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // ADD STATUS
  const addStatus = useCallback(
    async ({ status }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { status };

        const res = await axios.post(`${backendUrl}/furnishing-statuses/saveFurnishingStatus`, payload, {
          headers: {
            "Content-Type": "application/json",
            secret_key: secretKey,
          },
        });

        await fetchStatuses();
        return res.data;
      } catch (err) {
        console.error("Error adding furnishing status:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchStatuses]
  );

  // UPDATE STATUS
  const updateStatus = useCallback(
    async ({ id, status }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { status };

        const res = await axios.put(`${backendUrl}/furnishing-statuses/updateFurnishingStatus/${id}`, payload, {
          headers: {
            "Content-Type": "application/json",
            secret_key: secretKey,
          },
        });

        await fetchStatuses();
        return res.data;
      } catch (err) {
        console.error("Error updating furnishing status:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchStatuses]
  );

  // DELETE STATUS
  const deleteStatus = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(`${backendUrl}/furnishing-statuses/deleteFurnishingStatus/${id}`, {
          headers: { secret_key: secretKey },
        });

        await fetchStatuses();
        return res.data;
      } catch (err) {
        console.error("Error deleting furnishing status:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchStatuses]
  );

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  return {
    statuses,
    loading,
    fetchStatuses,
    getStatusById,
    addStatus,
    updateStatus,
    deleteStatus,
  };
};

export default useFurnishingStatuses;

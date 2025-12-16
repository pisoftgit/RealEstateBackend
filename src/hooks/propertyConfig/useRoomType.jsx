import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useRoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapRoomType = (item) => ({
    id: item.id?.toString(),
    type: item.type || "N/A",
  });

  // Fetch All Room Types
  const fetchRoomTypes = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/room-types/getAllRoomTypes`, {
        headers: { secret_key: secretKey },
      });

      const data = res.data?.data || res.data;
      setRoomTypes(Array.isArray(data) ? data.map(mapRoomType) : []);
    } catch (err) {
      console.error("Error fetching room types:", err?.response?.data || err.message);
      setRoomTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get Room Type by ID
  const getRoomTypeById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/room-types/getRoomTypeById/${id}`, {
        headers: { secret_key: secretKey },
      });

      const item = res.data?.data || res.data;
      return mapRoomType(item);
    } catch (err) {
      console.error("Error fetching room type by ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // Add New Room Type
  const addRoomType = useCallback(
    async ({ type }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { type };

        const res = await axios.post(
          `${backendUrl}/room-types/saveRoomType`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchRoomTypes();
        return res.data;
      } catch (err) {
        console.error("Error adding room type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchRoomTypes]
  );

  // Update Room Type
  const updateRoomType = useCallback(
    async ({ id, type }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { type };

        const res = await axios.put(
          `${backendUrl}/room-types/updateRoomType/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchRoomTypes();
        return res.data;
      } catch (err) {
        console.error("Error updating room type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchRoomTypes]
  );

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  return {
    roomTypes,
    loading,
    fetchRoomTypes,
    getRoomTypeById,
    addRoomType,
    updateRoomType,
  };
};

export default useRoomTypes;

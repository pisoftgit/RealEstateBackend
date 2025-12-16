import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useFaceDirections = () => {
  const [faceDirections, setFaceDirections] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapFaceDirection = (item) => ({
    id: item.id?.toString(),
    faceDirection: item.faceDirection || "N/A",
  });

  // FETCH ALL
  const fetchFaceDirections = useCallback(async () => {
    setLoading(true);

    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/face-directions/getAllFaceDirection`, {
        headers: { secret_key: secretKey },
      });

      const data = res.data?.data || res.data;
      setFaceDirections(Array.isArray(data) ? data.map(mapFaceDirection) : []);
    } catch (err) {
      console.error("Error fetching face directions:", err?.response?.data || err.message);
      setFaceDirections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET BY ID
  const getFaceDirectionById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/face-directions/getFaceDirectionById/${id}`,
        { headers: { secret_key: secretKey } }
      );

      const item = res.data?.data || res.data;
      return mapFaceDirection(item);
    } catch (err) {
      console.error("Error fetching face direction by ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // ADD
  const addFaceDirection = useCallback(
    async ({ faceDirection }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { faceDirection };

        const res = await axios.post(
          `${backendUrl}/face-directions/saveFaceDirection`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchFaceDirections();
        return res.data;
      } catch (err) {
        console.error("Error adding face direction:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchFaceDirections]
  );

  // UPDATE
  const updateFaceDirection = useCallback(
    async ({ id, faceDirection }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { faceDirection };

        const res = await axios.put(
          `${backendUrl}/face-directions/updateFaceDirection/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchFaceDirections();
        return res.data;
      } catch (err) {
        console.error("Error updating face direction:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchFaceDirections]
  );

  // DELETE
  const deleteFaceDirection = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/face-directions/deleteFaceDirection/${id}`,
          {
            headers: { secret_key: secretKey },
          }
        );

        await fetchFaceDirections();
        return res.data;
      } catch (err) {
        console.error("Error deleting face direction:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchFaceDirections]
  );

  useEffect(() => {
    fetchFaceDirections();
  }, [fetchFaceDirections]);

  return {
    faceDirections,
    loading,

    fetchFaceDirections,
    getFaceDirectionById,

    addFaceDirection,
    updateFaceDirection,
    deleteFaceDirection,
  };
};

export default useFaceDirections;

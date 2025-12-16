import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useReras = () => {
  const [reras, setReras] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapRera = (item) => ({
    id: item.id?.toString(),
    name: item.name || "N/A",
  });

  // FETCH ALL RERAS
  const fetchReras = useCallback(async () => {
    setLoading(true);

    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/reras/getAllReras`, {
        headers: { secret_key: secretKey },
      });

      const data = res.data?.data || res.data;

      setReras(Array.isArray(data) ? data.map(mapRera) : []);
    } catch (err) {
      console.error("Error fetching RERAs:", err?.response?.data || err.message);
      setReras([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET RERA BY ID
  const getReraById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/reras/getReraById/${id}`, {
        headers: { secret_key: secretKey },
      });

      const item = res.data?.data || res.data;
      return mapRera(item);
    } catch (err) {
      console.error("Error fetching RERA by ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // ADD RERA
  const addRera = useCallback(
    async ({ name }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { name };

        const res = await axios.post(`${backendUrl}/reras/saveRera`, payload, {
          headers: {
            "Content-Type": "application/json",
            secret_key: secretKey,
          },
        });

        await fetchReras();
        return res.data;
      } catch (err) {
        console.error("Error adding RERA:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchReras]
  );

  // UPDATE RERA
  const updateRera = useCallback(
    async ({ id, name }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { name };

        const res = await axios.put(
          `${backendUrl}/reras/updateRera/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchReras();
        return res.data;
      } catch (err) {
        console.error("Error updating RERA:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchReras]
  );

  // DELETE RERA
  const deleteRera = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(`${backendUrl}/reras/deleteRera/${id}`, {
          headers: { secret_key: secretKey },
        });

        await fetchReras();
        return res.data;
      } catch (err) {
        console.error("Error deleting RERA:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchReras]
  );

  useEffect(() => {
    fetchReras();
  }, [fetchReras]);

  return {
    reras,
    loading,

    fetchReras,
    getReraById,

    addRera,
    updateRera,
    deleteRera,
  };
};

export default useReras;

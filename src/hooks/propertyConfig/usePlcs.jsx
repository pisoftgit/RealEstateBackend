import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const usePlcs = () => {
  const [plcs, setPlcs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map API response
  const mapPlc = (item) => ({
    id: item.id,
    name: item.name || "N/A",
  });

  // FETCH ALL PLCs
  const fetchPlcs = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/plcs/getAllPlcs`, {
        headers: { secret_key: secretKey },
      });

      const data = res.data?.data || res.data;
      setPlcs(Array.isArray(data) ? data.map(mapPlc) : []);
    } catch (err) {
      console.error("Error fetching PLCs:", err?.response?.data || err.message);
      setPlcs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ADD PLC
  const addPlc = useCallback(
    async ({ name }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { name };

        const res = await axios.post(
          `${backendUrl}/plcs/savePlc`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchPlcs();
        return res.data;
      } catch (err) {
        console.error("Error adding PLC:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchPlcs]
  );

  // UPDATE PLC
  const updatePlc = useCallback(
    async ({ id, name }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { name };

        const res = await axios.put(
          `${backendUrl}/plcs/updatePlc/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchPlcs();
        return res.data;
      } catch (err) {
        console.error("Error updating PLC:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchPlcs]
  );

  // DELETE PLC
  const deletePlc = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(`${backendUrl}/plcs/deletePlc/${id}`, {
          headers: { secret_key: secretKey },
        });

        await fetchPlcs();
        return res.data;
      } catch (err) {
        console.error("Error deleting PLC:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchPlcs]
  );

  useEffect(() => {
    fetchPlcs();
  }, [fetchPlcs]);

  return {
    plcs,
    loading,
    fetchPlcs,
    addPlc,
    updatePlc,
    deletePlc,
  };
};

export default usePlcs;

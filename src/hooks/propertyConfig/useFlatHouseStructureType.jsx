import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useFlatHouseStructureTypes = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapType = (item) => ({
    id: item.id,
    structureType: item.structureType || "N/A",
  });

  // FETCH ALL TYPES
  const fetchTypes = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/flat-house-structure-types/getAllFlatHouseStructureTypes`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;
      setTypes(Array.isArray(data) ? data.map(mapType) : []);
    } catch (err) {
      console.error(
        "Error fetching flat/house structure types:",
        err?.response?.data || err.message
      );
      setTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ADD TYPE
  const addType = useCallback(
    async ({ structureType }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { structureType };

        const res = await axios.post(
          `${backendUrl}/flat-house-structure-types/saveFlatHouseStructureType`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchTypes();
        return res.data;
      } catch (err) {
        console.error(
          "Error adding flat/house structure type:",
          err?.response?.data || err.message
        );
        throw err;
      }
    },
    [fetchTypes]
  );

  // UPDATE TYPE
  const updateType = useCallback(
    async ({ id, structureType }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { structureType };

        const res = await axios.put(
          `${backendUrl}/flat-house-structure-types/updateFlatHouseStructureType/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchTypes();
        return res.data;
      } catch (err) {
        console.error(
          "Error updating flat/house structure type:",
          err?.response?.data || err.message
        );
        throw err;
      }
    },
    [fetchTypes]
  );

  // DELETE TYPE
  const deleteType = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/flat-house-structure-types/deleteFlatHouseStructureType/${id}`,
          {
            headers: { secret_key: secretKey },
          }
        );

        await fetchTypes();
        return res.data;
      } catch (err) {
        console.error(
          "Error deleting flat/house structure type:",
          err?.response?.data || err.message
        );
        throw err;
      }
    },
    [fetchTypes]
  );

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  return {
    types,
    loading,
    fetchTypes,
    addType,
    updateType,
    deleteType,
  };
};

export default useFlatHouseStructureTypes;

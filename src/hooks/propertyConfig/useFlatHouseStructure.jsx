import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useFlatHouseStructures = () => {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapStructure = (item) => ({
    id: item.id?.toString(),
    structureName: item.structureName || "N/A",
    flatHouseStructureType: item.flatHouseStructureType
      ? {
        id: item.flatHouseStructureType.id?.toString(),
        structureType: item.flatHouseStructureType.structureType || "N/A",
      }
      : {},
    structure: item.structure || "N/A",
  });

  // Fetch All Structures
  const fetchStructures = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/flat-house-structures/getAllFlatHouseStructures`,
        {
          headers: { secret_key: secretKey },
        }
      );

      const data = res.data?.data || res.data;
      setStructures(Array.isArray(data) ? data.map(mapStructure) : []);
    } catch (err) {
      console.error(
        "Error fetching flat house structures:",
        err?.response?.data || err.message
      );
      setStructures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get Structure by ID
  const getStructureById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/flat-house-structures/getFlatHouseStructureById/${id}`,
        {
          headers: { secret_key: secretKey },
        }
      );

      const item = res.data?.data || res.data;
      return mapStructure(item);
    } catch (err) {
      console.error(
        "Error fetching flat house structure by ID:",
        err?.response?.data || err.message
      );
      throw err;
    }
  }, []);

  // Add New Structure
  const addStructure = useCallback(
    async ({ structureName, flatHouseStructureTypeId, structure }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { structureName, flatHouseStructureTypeId, structure };

        const res = await axios.post(
          `${backendUrl}/flat-house-structures/saveFlatHouseStructure`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchStructures();
        return res.data;
      } catch (err) {
        console.error(
          "Error adding flat house structure:",
          err?.response?.data || err.message
        );
        throw err;
      }
    },
    [fetchStructures]
  );

  // Update Structure
  const updateStructure = useCallback(
    async ({ id, structureName, flatHouseStructureTypeId }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { structureName, flatHouseStructureTypeId }

        const res = await axios.put(
          `${backendUrl}/flat-house-structures/updateFlatHouseStructure/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchStructures();
        return res.data;
      } catch (err) {
        console.error(
          "Error updating flat house structure:",
          err?.response?.data || err.message
        );
        throw err;
      }
    },
    [fetchStructures]
  );

  // Delete Structure
  const deleteStructure = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/flat-house-structures/deleteFlatHouseStructure/${id}`,
          {
            headers: { secret_key: secretKey },
          }
        );

        await fetchStructures();
        return res.data;
      } catch (err) {
        console.error(
          "Error deleting flat house structure:",
          err?.response?.data || err.message
        );
        throw err;
      }
    },
    [fetchStructures]
  );

  useEffect(() => {
    fetchStructures();
  }, [fetchStructures]);

  return {
    structures,
    loading,
    fetchStructures,
    getStructureById,
    addStructure,
    updateStructure,
    deleteStructure,
  };
};

export default useFlatHouseStructures;

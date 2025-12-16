import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useMeasurementUnits = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapUnit = (item) => ({
    id: item.id?.toString(),
    unitName: item.unitName || "N/A",
  });

  // Fetch all units
  const fetchUnits = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/measurement-units/getAllMeasurementUnits`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;
      setUnits(Array.isArray(data) ? data.map(mapUnit) : []);
    } catch (err) {
      console.error("Error fetching measurement units:", err?.response?.data || err.message);
      setUnits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get unit by ID
  const getUnitById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/measurement-units/getMeasurementUnitById/${id}`,
        { headers: { secret_key: secretKey } }
      );

      const item = res.data?.data || res.data;
      return mapUnit(item);
    } catch (err) {
      console.error("Error fetching unit by ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // Add new unit
  const addUnit = useCallback(
    async ({ unitName }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { unitName };

        const res = await axios.post(
          `${backendUrl}/measurement-units/saveMeasurementUnit`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchUnits();
        return res.data;
      } catch (err) {
        console.error("Error adding measurement unit:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchUnits]
  );

  // Update unit
  const updateUnit = useCallback(
    async ({ id, unitName }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { unitName };

        const res = await axios.put(
          `${backendUrl}/measurement-units/updateMeasurementUnit/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchUnits();
        return res.data;
      } catch (err) {
        console.error("Error updating measurement unit:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchUnits]
  );

  // Delete unit
  const deleteUnit = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/measurement-units/deleteMeasurementUnit/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchUnits();
        return res.data;
      } catch (err) {
        console.error("Error deleting measurement unit:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchUnits]
  );

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return {
    units,
    loading,
    fetchUnits,
    getUnitById,
    addUnit,
    updateUnit,
    deleteUnit,
  };
};

export default useMeasurementUnits;

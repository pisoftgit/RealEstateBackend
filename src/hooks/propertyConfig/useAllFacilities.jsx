import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapFacility = (item) => ({
    id: item.id?.toString(),
    facilityName: item.facilityName || "N/A",
  });

  // FETCH ALL FACILITIES
  const fetchFacilities = useCallback(async () => {
    setLoading(true);

    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/facilities/getAllFacilites`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      setFacilities(Array.isArray(data) ? data.map(mapFacility) : []);
    } catch (err) {
      console.error("Error fetching facilities:", err?.response?.data || err.message);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET FACILITY BY ID
  const getFacilityById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/facilities/getFacilityById/${id}`,
        { headers: { secret_key: secretKey } }
      );

      const item = res.data?.data || res.data;
      return mapFacility(item);
    } catch (err) {
      console.error("Error fetching facility by ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // ADD FACILITY
  const addFacility = useCallback(
    async ({ facilityName }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { facilityName };

        const res = await axios.post(
          `${backendUrl}/facilities/saveFacility`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchFacilities();
        return res.data;
      } catch (err) {
        console.error("Error adding facility:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchFacilities]
  );

  // UPDATE FACILITY
  const updateFacility = useCallback(
    async ({ id, facilityName }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { facilityName };

        const res = await axios.put(
          `${backendUrl}/facilities/updateFacility/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchFacilities();
        return res.data;
      } catch (err) {
        console.error("Error updating facility:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchFacilities]
  );

  // DELETE FACILITY
  const deleteFacility = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/facilities/deleteFacility/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchFacilities();
        return res.data;
      } catch (err) {
        console.error("Error deleting facility:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchFacilities]
  );

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  return {
    facilities,
    loading,

    fetchFacilities,
    getFacilityById,

    addFacility,
    updateFacility,
    deleteFacility,
  };
};

export default useFacilities;

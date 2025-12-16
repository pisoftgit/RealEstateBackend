import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useAmenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapAmenity = (item) => ({
    id: item.id?.toString(),
    amenityName: item.amenityName || "N/A",
  });

  // FETCH ALL AMENITIES
  const fetchAmenities = useCallback(async () => {
    setLoading(true);

    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/amenities/getAllAmenities`, {
        headers: { secret_key: secretKey },
      });

      const data = res.data?.data || res.data;
      setAmenities(Array.isArray(data) ? data.map(mapAmenity) : []);
    } catch (err) {
      console.error("Error fetching amenities:", err?.response?.data || err.message);
      setAmenities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET AMENITY BY ID
  const getAmenityById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/amenities/getAminityById/${id}`, {
        headers: { secret_key: secretKey },
      });

      const item = res.data?.data || res.data;
      return mapAmenity(item);
    } catch (err) {
      console.error("Error fetching amenity by ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // ADD AMENITY
  const addAmenity = useCallback(
    async ({ amenityName }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { amenityName };

        const res = await axios.post(`${backendUrl}/amenities/saveAminity`, payload, {
          headers: {
            "Content-Type": "application/json",
            secret_key: secretKey,
          },
        });

        await fetchAmenities();
        return res.data;
      } catch (err) {
        console.error("Error adding amenity:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchAmenities]
  );

  // UPDATE AMENITY
  const updateAmenity = useCallback(
    async ({ id, amenityName }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { amenityName };

        const res = await axios.put(`${backendUrl}/amenities/updateAminity/${id}`, payload, {
          headers: {
            "Content-Type": "application/json",
            secret_key: secretKey,
          },
        });

        await fetchAmenities();
        return res.data;
      } catch (err) {
        console.error("Error updating amenity:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchAmenities]
  );

  // DELETE AMENITY
  const deleteAmenity = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(`${backendUrl}/amenities/delelteAminity/${id}`, {
          headers: { secret_key: secretKey },
        });

        await fetchAmenities();
        return res.data;
      } catch (err) {
        console.error("Error deleting amenity:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchAmenities]
  );

  useEffect(() => {
    fetchAmenities();
  }, [fetchAmenities]);

  return {
    amenities,
    loading,
    fetchAmenities,
    getAmenityById,
    addAmenity,
    updateAmenity,
    deleteAmenity,
  };
};

export default useAmenities;

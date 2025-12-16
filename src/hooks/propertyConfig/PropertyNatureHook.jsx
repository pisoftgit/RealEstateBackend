import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const usePropertyNature = () => {
  const [propertyNatures, setPropertyNatures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPropertyNatures = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/property-natures/getAllPropertyNatures`,
        {
          headers: { secret_key: secretKey },
        }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        const mapped = data.map((item) => ({
          id: item.id?.toString(),
          propertyNature: item.propertyNature || "N/A",
        }));
        setPropertyNatures(mapped);
      } else {
        setPropertyNatures([]);
      }
    } catch (err) {
      console.error("Error fetching property natures:", err?.response?.data || err.message);
      setPropertyNatures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ADD
  const addPropertyNature = useCallback(
    async ({ propertyNature }) => {
      try {
        const secretKey = localStorage.getItem("authToken");

        const payload = { propertyNature };

        const res = await axios.post(
          `${backendUrl}/property-natures/savePropertyNature`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchPropertyNatures();
        return res.data;
      } catch (err) {
        console.error("Error adding property nature:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchPropertyNatures]
  );

  // UPDATE
  const updatePropertyNature = useCallback(
    async ({ id, propertyNature }) => {
      try {
        const secretKey = localStorage.getItem("authToken");

        const payload = { propertyNature };

        const res = await axios.put(
          `${backendUrl}/property-natures/updatePropertyNature/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchPropertyNatures();
        return res.data;
      } catch (err) {
        console.error("Error updating property nature:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchPropertyNatures]
  );

  // DELETE
  const deletePropertyNature = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");

        const res = await axios.delete(
          `${backendUrl}/property-natures/deletePropertyNature/${id}`,
          {
            headers: { secret_key: secretKey },
          }
        );

        await fetchPropertyNatures();
        return res.data;
      } catch (err) {
        console.error("Error deleting property nature:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchPropertyNatures]
  );

  useEffect(() => {
    fetchPropertyNatures();
  }, [fetchPropertyNatures]);

  return {
    propertyNatures,
    loading,
    addPropertyNature,
    updatePropertyNature,
    deletePropertyNature,
  };
};

export default usePropertyNature;

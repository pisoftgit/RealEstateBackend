import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useBusinessNatureActions = () => {
  const [businessNatures, setBusinessNatures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinessNatures = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/business-nature/getAllBusinessNatures`, {
        headers: { "secret_key": secretKey},
      });

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        const mapped = data.map((item) => ({
          id: item.id?.toString(),
          name: item.nature || "N/A",
          code: item.code ?? null,
        }));
        setBusinessNatures(mapped);
      } else {
        setBusinessNatures([]);
      }
    } catch (err) {
      console.error("Error fetching business natures:", err?.response?.data || err.message);
      setBusinessNatures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a business nature
  const addBusinessNature = useCallback(
    async ({ nature, code }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { nature, code: Number(code) };

        const res = await axios.post(
          `${backendUrl}/business-nature/addBusinessNature`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchBusinessNatures();
        return res.data;
      } catch (err) {
        console.error("Error adding business nature:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchBusinessNatures]
  );

  //  Update a business nature
  const updateBusinessNature = useCallback(
    async ({ id, nature, code }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { nature, code: Number(code) };

        const res = await axios.put(
          `${backendUrl}/business-nature/updateBusinessNature/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchBusinessNatures();
        return res.data;
      } catch (err) {
        console.error("Error updating business nature:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchBusinessNatures]
  );

  // Delete a business nature
  const deleteBusinessNature = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/business-nature/deleteBusinessNature/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchBusinessNatures();
        return res.data;
      } catch (err) {
        console.error("Error deleting business nature:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchBusinessNatures]
  );

  //  Fetch on mount
  useEffect(() => {
    fetchBusinessNatures();
  }, [fetchBusinessNatures]);

  return {
    businessNatures,
    loading,
    fetchBusinessNatures,
    addBusinessNature,
    updateBusinessNature,
    deleteBusinessNature,
  };
};

export default useBusinessNatureActions;

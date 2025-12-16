import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useRealEstatePropertyTypes = () => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPropertyTypes = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/real-estate-property-types/getAllRealEstatePropertyTypes`,
        {
          headers: { secret_key: secretKey },
        }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        const mapped = data.map((item) => ({
          id: item.id?.toString(),
          name: item.name || "N/A",
          code: item.code ?? "",
          isResidential: Boolean(item.isResidential),
          isCommercial: Boolean(item.isCommercial),
        }));

        setPropertyTypes(mapped);
      } else {
        setPropertyTypes([]);
      }
    } catch (err) {
      console.error("Error fetching real estate property types:", err);
      setPropertyTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ADD
  const addPropertyType = useCallback(
    async ({ name, code, isResidential, isCommercial }) => {
      try {
        const secretKey = localStorage.getItem("authToken");

        const payload = {
          name,
          code: Number(code),
          isResidential,
          isCommercial,
        };

        const res = await axios.post(
          `${backendUrl}/real-estate-property-types/saveRealEstatePropertyType`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchPropertyTypes();
        return res.data;
      } catch (err) {
        console.error("Error adding property type:", err);
        throw err;
      }
    },
    [fetchPropertyTypes]
  );

  // UPDATE
  const updatePropertyType = useCallback(
    async ({ id, name, code, isResidential, isCommercial }) => {
      try {
        const secretKey = localStorage.getItem("authToken");

        const payload = {
          name,
          code: Number(code),
          isResidential,
          isCommercial,
        };

        const res = await axios.put(
          `${backendUrl}/real-estate-property-types/updateRealEstatePropertyType/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchPropertyTypes();
        return res.data;
      } catch (err) {
        console.error("Error updating property type:", err);
        throw err;
      }
    },
    [fetchPropertyTypes]
  );

  // DELETE
  const deletePropertyType = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");

        const res = await axios.delete(
          `${backendUrl}/real-estate-property-types/deleteRealEstatePropertyType/${id}`,
          {
            headers: { secret_key: secretKey },
          }
        );

        await fetchPropertyTypes();
        return res.data;
      } catch (err) {
        console.error("Error deleting property type:", err);
        throw err;
      }
    },
    [fetchPropertyTypes]
  );

  useEffect(() => {
    fetchPropertyTypes();
  }, [fetchPropertyTypes]);

  return {
    propertyTypes,
    loading,
    addPropertyType,
    updatePropertyType,
    deletePropertyType,
  };
};

export default useRealEstatePropertyTypes;

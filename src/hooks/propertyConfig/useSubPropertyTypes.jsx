import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useSubPropertyTypes = () => {
  const [subPropertyTypes, setSubPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubPropertyTypes = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/sub-property-types/getAllSubPropertyTypes`,
        { headers: { secret_key: secretKey } }
      );

      setSubPropertyTypes(res.data || []);
    } catch (err) {
      console.error("Error fetching sub property types:", err);
      setSubPropertyTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSubPropertyType = useCallback(
    async ({ name, natureCode, realEstatePropertyTypeId }) => {
      try {
        const secretKey = localStorage.getItem("authToken");

        const payload = {
          name,
          natureCode: Number(natureCode),
          realEstatePropertyType: { id: Number(realEstatePropertyTypeId) },
        };

        const res = await axios.post(
          `${backendUrl}/sub-property-types/saveSubPropertyType`,
          payload,
          {
            headers: { "Content-Type": "application/json", secret_key: secretKey },
          }
        );

        await fetchSubPropertyTypes();
        return res.data;
      } catch (err) {
        console.error("Error adding sub property type:", err);
        throw err;
      }
    },
    [fetchSubPropertyTypes]
  );

  const updateSubPropertyType = useCallback(
    async ({ id, name, natureCode, realEstatePropertyTypeId }) => {
      try {
        const secretKey = localStorage.getItem("authToken");

        const payload = {
          name,
          natureCode: Number(natureCode),
          realEstatePropertyType: { id: Number(realEstatePropertyTypeId) },
        };

        const res = await axios.put(
          `${backendUrl}/sub-property-types/updateSubPropertyType/${id}`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchSubPropertyTypes();
        return res.data;
      } catch (err) {
        console.error("Error updating sub property type:", err);
        throw err;
      }
    },
    [fetchSubPropertyTypes]
  );

  const deleteSubPropertyType = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");

        const res = await axios.delete(
          `${backendUrl}/sub-property-types/deleteSubPropertyType/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchSubPropertyTypes();
        return res.data;
      } catch (err) {
        console.error("Error deleting sub property type:", err);
        throw err;
      }
    },
    [fetchSubPropertyTypes]
  );

  useEffect(() => {
    fetchSubPropertyTypes();
  }, [fetchSubPropertyTypes]);

  return {
    subPropertyTypes,
    loading,
    addSubPropertyType,
    updateSubPropertyType,
    deleteSubPropertyType,
    fetchSubPropertyTypes,
  };
};

export default useSubPropertyTypes;

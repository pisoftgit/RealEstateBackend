import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const usePropertyItems = () => {
  const [propertyItems, setPropertyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapPropertyItem = (item) => ({
    id: item.id?.toString(),
    name: item.name || "N/A",
    code: item.code ?? null,

    isFlat: Boolean(item.isFlat),
    isHouseVilla: Boolean(item.isHouseVilla),
    isPlot: Boolean(item.isPlot),
    isCommercialUnit: Boolean(item.isCommercialUnit),
    isResidential: Boolean(item.isResidential),
    isCommercial: Boolean(item.isCommercial),

    realEstatePropertyType: item.realEstatePropertyType
      ? {
          id: item.realEstatePropertyType.id?.toString(),
          name: item.realEstatePropertyType.name || "N/A",
          code: item.realEstatePropertyType.code ?? null,
          isResidential: Boolean(item.realEstatePropertyType.isResidential),
          isCommercial: Boolean(item.realEstatePropertyType.isCommercial),
        }
      : null,
  });

  // FETCH ALL
  const fetchPropertyItems = useCallback(async () => {
    setLoading(true);

    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/property-items/getAllPropertyItems`,
        {
          headers: { secret_key: secretKey },
        }
      );

      const data = res.data?.data || res.data;

      setPropertyItems(Array.isArray(data) ? data.map(mapPropertyItem) : []);
    } catch (err) {
      console.error("Error fetching property items:", err?.response?.data || err.message);
      setPropertyItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // FETCH BY ID
  const getPropertyItemById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/property-items/getPropertyItemById/${id}`,
        {
          headers: { secret_key: secretKey },
        }
      );

      const item = res.data?.data || res.data;
      return mapPropertyItem(item);
    } catch (err) {
      console.error("Error fetching item by ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // FETCH BY REAL ESTATE PROPERTY TYPE ID
  const fetchPropertyItemsByTypeId = useCallback(async (propertyTypeId) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/property-items/getPropertyItemsByPropertyTypeId/${propertyTypeId}`,
        {
          headers: { secret_key: secretKey },
        }
      );

      const data = res.data?.data || res.data;
      return Array.isArray(data) ? data.map(mapPropertyItem) : [];
    } catch (err) {
      console.error("Error fetching by property type ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // ADD PROPERTY ITEM
  const addPropertyItem = useCallback(
    async ({
      name,
      code,
      realEstatePropertyTypeId,
      isFlat,
      isHouseVilla,
      isPlot,
      isCommercialUnit,
      isResidential,
      isCommercial,
    }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = {
          name,
          code: Number(code),
          realEstatePropertyTypeId: Number(realEstatePropertyTypeId),

          isFlat: Boolean(isFlat),
          isHouseVilla: Boolean(isHouseVilla),
          isPlot: Boolean(isPlot),
          isCommercialUnit: Boolean(isCommercialUnit),
          isResidential: Boolean(isResidential),
          isCommercial: Boolean(isCommercial),
        };

        const res = await axios.post(
          `${backendUrl}/property-items/savePropertyItem`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchPropertyItems();
        return res.data;
      } catch (err) {
        console.error("Error adding property item:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchPropertyItems]
  );

  // UPDATE PROPERTY ITEM
  const updatePropertyItem = useCallback(
    async ({
      id,
      name,
      code,
      realEstatePropertyTypeId,
      isFlat,
      isHouseVilla,
      isPlot,
      isCommercialUnit,
      isResidential,
      isCommercial,
    }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = {
          name,
          code: Number(code),
          realEstatePropertyTypeId: Number(realEstatePropertyTypeId),

          isFlat: Boolean(isFlat),
          isHouseVilla: Boolean(isHouseVilla),
          isPlot: Boolean(isPlot),
          isCommercialUnit: Boolean(isCommercialUnit),
          isResidential: Boolean(isResidential),
          isCommercial: Boolean(isCommercial),
        };

        const res = await axios.put(
          `${backendUrl}/property-items/updatePropertyItem/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchPropertyItems();
        return res.data;
      } catch (err) {
        console.error("Error updating property item:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchPropertyItems]
  );

  // DELETE
  const deletePropertyItem = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/property-items/deletePropertyItem/${id}`,
          {
            headers: { secret_key: secretKey },
          }
        );

        await fetchPropertyItems();
        return res.data;
      } catch (err) {
        console.error("Error deleting property item:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchPropertyItems]
  );

  useEffect(() => {
    fetchPropertyItems();
  }, [fetchPropertyItems]);

  return {
    propertyItems,
    loading,

    fetchPropertyItems,
    getPropertyItemById,
    fetchPropertyItemsByTypeId,

    addPropertyItem,
    updatePropertyItem,
    deletePropertyItem,
  };
};

export default usePropertyItems;

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useSerialize = () => {
  // -------------------------------
  // State
  // -------------------------------
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [subPropertyTypes, setSubPropertyTypes] = useState([]);
  const [towerItems, setTowerItems] = useState([]);
  const [towerUnits, setTowerUnits] = useState([]);
  const [structures, setStructures] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  const secretKey = localStorage.getItem("authToken");

  // -------------------------------
  // Helper: Map property type
  // -------------------------------
  const mapPropertyType = (item) => ({
    id: item.id?.toString(),
    name: item.name || "N/A",
    code: item.code ?? "",
    isResidential: Boolean(item.isResidential),
    isCommercial: Boolean(item.isCommercial),
  });

  // -------------------------------
  // FETCH Property Types
  // -------------------------------
  const fetchPropertyTypes = useCallback(async () => {
    setLoading(true);
    try {
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/real-estate-property-types/getAllRealEstatePropertyTypes`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      setPropertyTypes(Array.isArray(data) ? data.map(mapPropertyType) : []);
    } catch (err) {
      console.error("Error fetching property types:", err);
      setPropertyTypes([]);
    } finally {
      setLoading(false);
    }
  }, [secretKey]);

  // -------------------------------
  // FETCH Sub Property Types
  // -------------------------------
  const fetchSubPropertyTypes = useCallback(async () => {
    setLoading(true);
    try {
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
  }, [secretKey]);

  // -------------------------------
  // FETCH Tower Items
  // -------------------------------
  const fetchTowerItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/tower-property-items/getAllTowerPropertyItems`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data || [];

      setTowerItems(
        Array.isArray(data)
          ? data.map((i) => ({
              id: i.id?.toString(),
              name: i.name,
              code: i.code,
              isHouseVilla: Boolean(i.isHouseVilla),
              isFlat: Boolean(i.isFlat),
            }))
          : []
      );
    } catch (err) {
      console.error("Error fetching tower items:", err);
      setTowerItems([]);
    } finally {
      setLoading(false);
    }
  }, [secretKey]);

  // -------------------------------
  // FETCH Tower Units
  // -------------------------------
  const fetchTowerUnitCodes = useCallback(async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/real-estate-properties/getAllTowerPropertyUnit`,
        { headers: { secret_key: secretKey } }
      );

      let data = res.data?.data || res.data || [];

      if (!Array.isArray(data)) data = [data];

      setTowerUnits(
        data.map((u) => ({
          name: u.name,
          code: Number(u.code),
        }))
      );
    } catch (err) {
      console.error("Error fetching tower unit codes:", err);
      setTowerUnits([]);
    }
  }, [secretKey]);

  // -------------------------------
  // FETCH Structures by Project/SubProperty/FloorUnit
  // -------------------------------
  const fetchStructures = useCallback(
    async ({ projectId, subPropertyTypeId, floorUnitId }) => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${backendUrl}/real-estate-properties/getStructureByProjectIdAndSubPropertyTypeIdOfLinkableProperty`,
          {
            params: { projectId, subPropertyTypeId, floorUnitId },
            headers: { secret_key: secretKey },
          }
        );

        const data = res.data?.data || res.data || [];
        setStructures(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching structures:", err);
        setStructures([]);
      } finally {
        setLoading(false);
      }
    },
    [secretKey]
  );

  // -------------------------------
  // FETCH Areas by SubProperty/Structure/FloorUnit
  // -------------------------------
  const fetchAreas = useCallback(
    async ({ projectId, subPropertyTypeId, floorUnitId, structureId }) => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${backendUrl}/real-estate-properties/getPropertyAreasBySubPropertyTypeIdAndStructureIdAndFloorUnit`,
          {
            params: { projectId, subPropertyTypeId, floorUnitId, structureId },
            headers: { secret_key: secretKey },
          }
        );

        const data = res.data?.data || res.data || [];
        setAreas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching areas:", err);
        setAreas([]);
      } finally {
        setLoading(false);
      }
    },
    [secretKey]
  );

  // -------------------------------
  // Initial Fetch
  // -------------------------------
  useEffect(() => {
    fetchPropertyTypes();
    fetchSubPropertyTypes();
    fetchTowerItems();
    fetchTowerUnitCodes();
  }, [fetchPropertyTypes, fetchSubPropertyTypes, fetchTowerItems, fetchTowerUnitCodes]);

  return {
    propertyTypes,
    subPropertyTypes,
    towerItems,
    towerUnits,
    structures,
    areas,
    loading,
    fetchStructures,
    fetchAreas,
  };
};

export default useSerialize;

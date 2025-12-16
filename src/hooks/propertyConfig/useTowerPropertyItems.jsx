import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useTowerPropertyItems = () => {
  const [items, setItems] = useState([]);
  const [towerUnits, setTowerUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const secretKey = localStorage.getItem("authToken");

  // ----------------------------------------------------------------
  // FETCH ALL TOWER PROPERTY ITEMS
  // ----------------------------------------------------------------
  const fetchTowerItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/tower-property-items/getAllTowerPropertyItems`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data || [];

      if (!Array.isArray(data)) {
        console.warn("Tower items received non-array:", data);
        setItems([]);
        return;
      }

      setItems(
        data.map((i) => ({
          id: i.id?.toString(),
          name: i.name,
          code: i.code,
          isHouseVilla: Boolean(i.isHouseVilla),
          isFlat: Boolean(i.isFlat),
        }))
      );
    } catch (err) {
      console.error("Error fetching tower items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------------------------------
  // FETCH TOWER UNIT CODES (FOR DROPDOWN)
  // ----------------------------------------------------------------
  const fetchTowerUnitCodes = useCallback(async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/real-estate-properties/getAllTowerPropertyUnit`,
        { headers: { secret_key: secretKey } }
      );

      let data = res.data?.data || res.data || [];

      // FIX: Convert single object into array
      if (!Array.isArray(data)) {
        data = [data];
      }

      setTowerUnits(
        data.map((u) => ({
          name: u.name,
          code: Number(u.code),
        }))
      );
    } catch (err) {
      console.error("Error fetching Tower Unit Codes:", err);
      setTowerUnits([]);
    }
  }, []);

  // ----------------------------------------------------------------
  // ADD NEW ITEM
  // ----------------------------------------------------------------
  const addTowerItem = useCallback(
    async ({ name, code }) => {
      try {
        const payload = { name, code: Number(code) };

        const res = await axios.post(
          `${backendUrl}/tower-property-items/saveTowerPropertyItem`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchTowerItems();
        return res.data;
      } catch (err) {
        console.error("Error creating tower item:", err);
        throw err;
      }
    },
    [fetchTowerItems]
  );

  // ----------------------------------------------------------------
  // UPDATE ITEM
  // ----------------------------------------------------------------
  const updateTowerItem = useCallback(
    async ({ id, name, code }) => {
      try {
        const payload = { name, code: Number(code) };

        const res = await axios.put(
          `${backendUrl}/tower-property-items/updateTowerPropertyItem/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchTowerItems();
        return res.data;
      } catch (err) {
        console.error("Error updating tower item:", err);
        throw err;
      }
    },
    [fetchTowerItems]
  );

  // ----------------------------------------------------------------
  // DELETE ITEM
  // ----------------------------------------------------------------
  const deleteTowerItem = useCallback(
    async (id) => {
      try {
        const res = await axios.delete(
          `${backendUrl}/tower-property-items/deleteTowerPropertyItem/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchTowerItems();
        return res.data;
      } catch (err) {
        console.error("Error deleting tower item:", err);
        throw err;
      }
    },
    [fetchTowerItems]
  );

  useEffect(() => {
    fetchTowerItems();
    fetchTowerUnitCodes();
  }, []);

  return {
    items,
    towerUnits,
    loading,
    addTowerItem,
    updateTowerItem,
    deleteTowerItem,
  };
};

export default useTowerPropertyItems;

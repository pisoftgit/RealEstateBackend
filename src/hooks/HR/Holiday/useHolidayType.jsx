import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useHolidayTypesActions = () => {
  const [holidayTypes, setHolidayTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Holiday Types
   * --------------------------------
   */
  const fetchHolidayTypes = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/holiday-type/`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        setHolidayTypes(data.map(item => ({
          id: item.id.toString(),
          holidayName: item.holidayName || "N/A",
        })));
      } else {
        setHolidayTypes([]);
      }
    } catch (err) {
      console.error("Error fetching holiday types:", err?.response?.data || err.message);
      setHolidayTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Add Holiday Type
   * --------------------------------
   */
  const addHolidayType = useCallback(
    async (holidayName) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { holidayName };

        const res = await axios.post(
          `${backendUrl}/holiday-type/`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchHolidayTypes();
        return res.data;
      } catch (err) {
        console.error("Error adding holiday type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchHolidayTypes]
  );

  /** -------------------------------
   *   Update Holiday Type
   * --------------------------------
   */
  const updateHolidayType = useCallback(
    async (id, holidayName) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { holidayName };

        const res = await axios.put(
          `${backendUrl}/holiday-type/${id}`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchHolidayTypes();
        return res.data;
      } catch (err) {
        console.error("Error updating holiday type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchHolidayTypes]
  );

  /** -------------------------------
   *   Delete Holiday Type
   * --------------------------------
   */
  const deleteHolidayType = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/holiday-type/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchHolidayTypes();
        return res.data;
      } catch (err) {
        console.error("Error deleting holiday type:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchHolidayTypes]
  );

  /** -------------------------------
   *   Fetch on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchHolidayTypes();
  }, [fetchHolidayTypes]);

  return {
    holidayTypes,
    loading,
    fetchHolidayTypes,
    addHolidayType,
    updateHolidayType,
    deleteHolidayType,
  };
};

export default useHolidayTypesActions;

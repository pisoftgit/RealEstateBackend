import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useFinancialYearActions = () => {
  const [financialYears, setFinancialYears] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Financial Years
   * --------------------------------
   */
  const fetchFinancialYears = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/FinancialYear/getAllFinancialYears`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        const mapped = data.map((item) => ({
          id: item.id?.toString(),
          year: item.name || "N/A",             // API now uses `name`
          startDate: item.startDate || null,
          endDate: item.endDate || null,
          status: item.currentYear ?? false,    // API now uses `currentYear`
        }));

        setFinancialYears(mapped);
      } else {
        setFinancialYears([]);
      }
    } catch (err) {
      console.error("Error fetching financial years:", err?.response?.data || err.message);
      setFinancialYears([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Add Financial Year
   * --------------------------------
   */
  const addFinancialYear = useCallback(
    async ({ year, startDate, endDate, status }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = {
          name: year,               // API expects `name`
          startDate,
          endDate,
          currentYear: status,      // API expects `currentYear`
        };

        const res = await axios.post(
          `${backendUrl}/FinancialYear/save`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchFinancialYears();
        return res.data;
      } catch (err) {
        console.error("Error adding financial year:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchFinancialYears]
  );

  /** -------------------------------
   *   Update Financial Year
   * --------------------------------
   */
  const updateFinancialYear = useCallback(
    async ({ id, year, startDate, endDate, status }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = {
          name: year,
          startDate,
          endDate,
          currentYear: status,
        };

        const res = await axios.put(
          `${backendUrl}/FinancialYear/update/${id}`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchFinancialYears();
        return res.data;
      } catch (err) {
        console.error("Error updating financial year:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchFinancialYears]
  );

  /** -------------------------------
   *   Delete Financial Year
   * --------------------------------
   */
  const deleteFinancialYear = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/FinancialYear/delete/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchFinancialYears();
        return res.data;
      } catch (err) {
        console.error("Error deleting financial year:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchFinancialYears]
  );

  /** -------------------------------
   *   Fetch on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchFinancialYears();
  }, [fetchFinancialYears]);

  return {
    financialYears,
    loading,
    fetchFinancialYears,
    addFinancialYear,
    updateFinancialYear,
    deleteFinancialYear,
  };
};

export default useFinancialYearActions;

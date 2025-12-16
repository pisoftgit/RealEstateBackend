import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const secretKey = localStorage.getItem("authToken")

const useHolidayActions = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/holidays`, {
        headers: { secret_key: secretKey },
      });
      setHolidays(res.data.data ||res.data|| []);
    } catch (err) {
      console.error("Error fetching holidays:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // Add Holiday
  // ------------------------
  const addHoliday = async (holidayData) => {
    try {
      const res = await axios.post(
        `${backendUrl}/holidays`,
        holidayData,
        { headers: { secret_key: secretKey } }
      );
      await fetchHolidays();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // ------------------------
  // Update Holiday
  // ------------------------
  const updateHoliday = async (id, updatedData) => {
    const data = {...updatedData, id}
    try {
      const res = await axios.post(
        `${backendUrl}/holidays`,
        data,
        { headers: { secret_key: secretKey } }
      );
      await fetchHolidays();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // ------------------------
  // Delete Holiday
  // ------------------------
  const deleteHoliday = async (id) => {
    try {
      const res = await axios.delete(
        `${backendUrl}/holidays/${id}`,
        { headers: { secret_key: secretKey } }
      );
      await fetchHolidays();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  return { holidays, loading, addHoliday, updateHoliday, deleteHoliday };
};

export default useHolidayActions;

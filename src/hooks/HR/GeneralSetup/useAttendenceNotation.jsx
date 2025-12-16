import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useAttendanceNotationActions = () => {
  const [notations, setNotations] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Attendance Notations
   * --------------------------------
   */
  const fetchNotations = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/attendance-notation/`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        setNotations(data.map(item => ({
          id: item.id.toString(),
          attendanceNotation: item.attendanceNotation || "N/A",
          color: item.color || "#000000",
          description: item.description || "",
          attendanceNotationCode: item.attendanceNotationCode || null,
        })));
      } else {
        setNotations([]);
      }
    } catch (err) {
      console.error("Error fetching attendance notations:", err?.response?.data || err.message);
      setNotations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Add Attendance Notation
   * --------------------------------
   */
  const addNotation = useCallback(
    async (attendanceNotation, color, description, attendanceNotationCode) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { attendanceNotation, color, description, attendanceNotationCode };

        const res = await axios.post(
          `${backendUrl}/attendance-notation/`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchNotations();
        return res.data;
      } catch (err) {
        console.error("Error adding attendance notation:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchNotations]
  );

  /** -------------------------------
   *   Update Attendance Notation
   * --------------------------------
   */
  const updateNotation = useCallback(
    async (id, attendanceNotation, color, description, attendanceNotationCode) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { attendanceNotation, color, description, attendanceNotationCode };

        const res = await axios.put(
          `${backendUrl}/attendance-notation/${id}`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchNotations();
        return res.data;
      } catch (err) {
        console.error("Error updating attendance notation:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchNotations]
  );

  /** -------------------------------
   *   Delete Attendance Notation
   * --------------------------------
   */
  const deleteNotation = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/attendance-notation/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchNotations();
        return res.data;
      } catch (err) {
        console.error("Error deleting attendance notation:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchNotations]
  );

  /** -------------------------------
   *   Fetch on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchNotations();
  }, [fetchNotations]);

  return {
    notations,
    loading,
    fetchNotations,
    addNotation,
    updateNotation,
    deleteNotation,
  };
};

export default useAttendanceNotationActions;

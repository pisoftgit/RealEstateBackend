import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const secretKey = localStorage.getItem("authToken");

const useDurationActions = () => {
  const [durations, setDurations] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===========================================
  // GET ALL DURATIONS
  // ===========================================
  const fetchDurations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/duration/`, {
        headers: { secret_key: secretKey },
      });
      setDurations(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to load durations", err);
    } finally {
      setLoading(false);
    }
  };

  // ===========================================
  // ADD DURATION
  // ===========================================
  const addDuration = async (statusName) => {
    try {
      await axios.post(
        `${backendUrl}/duration/`,
        { status: statusName },
        { headers: { secret_key: secretKey } }
      );
      fetchDurations();
    } catch (err) {
      console.error("Add duration error:", err);
    }
  };

  // ===========================================
  // UPDATE DURATION
  // ===========================================
  const updateDuration = async (id, updatedName) => {
    try {
      await axios.put(
        `${backendUrl}/duration/${id}`,
        { status: updatedName },
        { headers: { secret_key: secretKey } }
      );
      fetchDurations();
    } catch (err) {
      console.error("Update duration error:", err);
    }
  };

  // ===========================================
  // DELETE DURATION
  // ===========================================
  const deleteDuration = async (id) => {
    try {
      await axios.delete(`${backendUrl}/duration/${id}`, {
        headers: { secret_key: secretKey },
      });
      fetchDurations();
    } catch (err) {
      console.error("Delete duration error:", err);
    }
  };

  useEffect(() => {
    fetchDurations();
  }, []);

  return {
    durations,
    loading,
    addDuration,
    updateDuration,
    deleteDuration,
  };
};

export default useDurationActions;

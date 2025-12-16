import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useStateManagement = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState(null);

  // Fetch states when the country is selected
  const fetchStatesByCountryId = useCallback(async (countryId) => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const response = await axios.get(
        `${backendUrl}/state/country/${countryId}`,
        {
          headers: { secret_key: secretKey },
        }
      );
      setStates(response.data);  // Ensure states are set correctly
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      setStates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCountryId) {
      fetchStatesByCountryId(selectedCountryId);
    }
  }, [selectedCountryId, fetchStatesByCountryId]);

  // Add a new state
  const addState = async (stateName, stateCode) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = {
        state: stateName,
        stateCode,
        country: { id: selectedCountryId },
      };

      await axios.post(
        `${backendUrl}/state/save`,
        payload,
        {
          headers: { secret_key: secretKey },
        }
      );
      fetchStatesByCountryId(selectedCountryId); // Refresh the state list
    } catch (err) {
      console.error("Error adding state:", err?.response?.data || err.message);
      throw err;
    }
  };

  // Update an existing state
  const updateState = async (id, stateName, stateCode) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = {
        state: stateName,
        stateCode,
        country: { id: selectedCountryId },
      };

      await axios.put(
        `${backendUrl}/state/update/${id}`,
        payload,
        {
          headers: { secret_key: secretKey },
        }
      );
      fetchStatesByCountryId(selectedCountryId); // Refresh the state list
    } catch (err) {
      console.error("Error updating state:", err?.response?.data || err.message);
      throw err;
    }
  };

  // Delete a state
  const deleteState = async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      await axios.delete(
        `${backendUrl}/state/delete/${id}`,
        {
          headers: { secret_key: secretKey },
        }
      );
      fetchStatesByCountryId(selectedCountryId); // Refresh the state list
    } catch (err) {
      console.error("Error deleting state:", err?.response?.data || err.message);
      throw err;
    }
  };

  return {
    states,
    loading,
    error,
    addState,
    updateState,
    deleteState,
    setSelectedCountryId,
  };
};

export default useStateManagement;

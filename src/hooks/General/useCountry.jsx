import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api"; 

const useCountry = () => {
  const [countries, setCountries] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Fetch all countries
  const fetchCountries = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const response = await axios.get(
        `${backendUrl}/country/getAllCountries`,
        {
          headers: { secret_key: secretKey },
        }
      );
      setCountries(response.data); 
    } catch (err) {
      setError(err?.response?.data?.message || err.message); 
      setCountries([]); 
    } finally {
      setLoading(false); 
    }
  }, []); 

  // Add new country
  const addCountry = async (countryName, countryCode) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = {
        country: countryName,
        countryCode,
      };

      await axios.post(
        `${backendUrl}/country/save`,
        payload,
        {
          headers: { secret_key: secretKey },
        }
      );
      fetchCountries(); // Refresh country list after adding
    } catch (err) {
      console.error("Error adding country:", err?.response?.data || err.message);
      throw err;
    }
  };

  // Update country
  const updateCountry = async (id, countryName, countryCode) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = {
        country: countryName,
        countryCode,
      };

      await axios.put(
        `${backendUrl}/country/update/${id}`,
        payload,
        {
          headers: { secret_key: secretKey },
        }
      );
      fetchCountries(); // Refresh country list after updating
    } catch (err) {
      console.error("Error updating country:", err?.response?.data || err.message);
      throw err;
    }
  };

  // Delete country
  const deleteCountry = async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      await axios.delete(
        `${backendUrl}/country/delete/${id}`,
        {
          headers: { secret_key: secretKey },
        }
      );
      fetchCountries(); // Refresh country list after deletion
    } catch (err) {
      console.error("Error deleting country:", err?.response?.data || err.message);
      throw err;
    }
  };

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]); 

  return {
    countries, 
    loading,
    error, 
    addCountry, 
    updateCountry, 
    deleteCountry, 
  };
};

export default useCountry;

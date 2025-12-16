import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useRealEstateCustomerLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapLead = (item) => ({
    id: item.id?.toString(),
    name: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
    description: item.leadFrom?.name || "No Lead Source",
    raw: item,
  });

  // GET ALL LEADS
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const secretKey = localStorage.getItem("authToken");

      const res = await axios.get(
        `${backendUrl}/realestateCustomerLead/getAllCustomerLeads`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || [];
      setLeads(Array.isArray(data) ? data.map(mapLead) : []);
    } catch (err) {
      console.error("Error fetching leads:", err.response?.data || err.message);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET SINGLE LEAD
  const getLeadById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");

      const res = await axios.get(
        `${backendUrl}/realEstate/realestateCustomerLead/getRealestateCustomerLead/${id}`,
        { headers: { secret_key: secretKey } }
      );

      return res.data?.data;
    } catch (err) {
      console.error("Error fetching lead:", err.response?.data || err.message);
      throw err;
    }
  }, []);

  // SAVE OR UPDATE LEAD
  const saveLead = useCallback(
    async (payload) => {
      try {
        const secretKey = localStorage.getItem("authToken");

        const res = await axios.post(
          `${backendUrl}/realestateCustomerLead/addRealestateCustomerLead`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchLeads();
        return res.data;
      } catch (err) {
        console.error("Error saving lead:", err.response?.data || err.message);
        throw err;
      }
    },
    [fetchLeads]
  );

  // DELETE LEAD
  const deleteLead = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");

        await axios.delete(
          `${backendUrl}/realestateCustomerLead/deleteRealestateCustomerLead/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchLeads();
      } catch (err) {
        console.error("Error deleting lead:", err.response?.data || err.message);
        throw err;
      }
    },
    [fetchLeads]
  );

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    loading,
    fetchLeads,
    getLeadById,
    saveLead,
    deleteLead,
  };
};

export default useRealEstateCustomerLeads;

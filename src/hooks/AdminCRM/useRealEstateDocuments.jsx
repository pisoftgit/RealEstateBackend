// useRealEstateDocuments.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useRealEstateDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapDocument = (item) => ({
    id: item.id?.toString(),
    documentName: item.documentName || "N/A",
    description: item.description || ""
  });

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/realEstateCustomerDocumentNames/getDocumentNamesList`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;
      setDocuments(Array.isArray(data) ? data.map(mapDocument) : []);
    } catch (err) {
      console.error("Error fetching documents:", err?.response?.data || err.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveDocument = useCallback(
    async ({ id, documentName, description }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = id
          ? { id, documentName, description }
          : { documentName, description };

        const res = await axios.post(
          `${backendUrl}/realEstateCustomerDocumentNames/saveDocumentName`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchDocuments();
        return res.data;
      } catch (err) {
        console.error("Error saving document:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchDocuments]
  );

  const deleteDocument = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/realEstateCustomerDocumentNames/deleteDocumentName/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchDocuments();
        return res.data;
      } catch (err) {
        console.error("Error deleting document:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchDocuments]
  );

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    saveDocument,
    deleteDocument,
  };
};

export default useRealEstateDocuments;

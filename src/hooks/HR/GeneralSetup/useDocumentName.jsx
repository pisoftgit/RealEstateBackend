import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";
const useDocumentNameActions = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Document Names
   * --------------------------------
   */
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/documents-name/`,
        { headers: { secret_key: secretKey } }
      );

      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        setDocuments(data.map(item => ({
          id: item.id.toString(),
          name: item.documentName || "N/A",
          description: item.description || "",
        })));
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error("Error fetching documents:", err?.response?.data || err.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Add Document Name
   * --------------------------------
   */
  const addDocument = useCallback(
    async (documentName, description) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { documentName, description };

        const res = await axios.post(
          `${backendUrl}/documents-name/`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchDocuments();
        return res.data;
      } catch (err) {
        console.error("Error adding document:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchDocuments]
  );

  /** -------------------------------
   *   Update Document Name
   * --------------------------------
   */
  const updateDocument = useCallback(
    async (id, documentName, description) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { documentName, description };

        const res = await axios.put(
          `${backendUrl}/documents-name/${id}`,
          payload,
          { headers: { "Content-Type": "application/json", secret_key: secretKey } }
        );

        await fetchDocuments();
        return res.data;
      } catch (err) {
        console.error("Error updating document:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchDocuments]
  );

  /** -------------------------------
   *   Delete Document Name
   * --------------------------------
   */
  const deleteDocument = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/documents-name/${id}`,
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

  /** -------------------------------
   *   Fetch on Mount
   * --------------------------------
   */
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    fetchDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
  };
};

export default useDocumentNameActions;

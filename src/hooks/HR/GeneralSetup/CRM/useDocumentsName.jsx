import { useState, useEffect } from "react";
import { backendUrl } from "../../../../ProtectedRoutes/api";

export const useDocumentNames = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authToken = localStorage.getItem("authToken");

  // -------- FETCH ALL --------
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/documents-name/`, {
        headers: { secret_key: authToken },
      });

      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  // -------- ADD DOCUMENT --------
  const addDocument = async (payload) => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/documents-name/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          secret_key: authToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      fetchDocuments();
      return data;
    } catch (err) {
      setError("Failed to add document");
    } finally {
      setLoading(false);
    }
  };

  // -------- UPDATE DOCUMENT --------
  const updateDocument = async (id, payload) => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/documents-name/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          secret_key: authToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      fetchDocuments();
      return data;
    } catch (err) {
      setError("Failed to update document");
    } finally {
      setLoading(false);
    }
  };

  // -------- DELETE DOCUMENT --------
  const deleteDocument = async (id) => {
    try {
      setLoading(true);
      await fetch(`${backendUrl}/documents-name/${id}`, {
        method: "DELETE",
        headers: {
          secret_key: authToken,
        },
      });

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      setError("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    fetchDocuments,
  };
};

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api"; 

const useCategoryActions = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------
   *   Fetch All Categories
   * --------------------------------
   */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/category/getAllCategories`, {
        headers: { secret_key: secretKey },
      });

      const data = res.data?.data || res.data;
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err?.response?.data || err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** -------------------------------
   *   Add Category
   * --------------------------------
   */
  const addCategory = useCallback(async (category) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = { category };
      const res = await axios.post(
        `${backendUrl}/category/add`,
        payload,
        {
          headers: { "Content-Type": "application/json", secret_key: secretKey },
        }
      );

      await fetchCategories(); // Refresh category list after add
      return res.data;
    } catch (err) {
      console.error("Error adding category:", err?.response?.data || err.message);
      throw err;
    }
  }, [fetchCategories]);

  /** -------------------------------
   *   Update Category
   * --------------------------------
   */
  const updateCategory = useCallback(async (id, category) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const payload = { category };
      const res = await axios.put(
        `${backendUrl}/category/update/${id}`,
        payload,
        {
          headers: { "Content-Type": "application/json", secret_key: secretKey },
        }
      );

      await fetchCategories(); // Refresh category list after update
      return res.data;
    } catch (err) {
      console.error("Error updating category:", err?.response?.data || err.message);
      throw err;
    }
  }, [fetchCategories]);

  /** -------------------------------
   *   Delete Category
   * --------------------------------
   */
  const deleteCategory = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.delete(`${backendUrl}/category/delete/${id}`, {
        headers: { secret_key: secretKey },
      });

      await fetchCategories(); // Refresh category list after delete
      return res.data;
    } catch (err) {
      console.error("Error deleting category:", err?.response?.data || err.message);
      throw err;
    }
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategoryActions;

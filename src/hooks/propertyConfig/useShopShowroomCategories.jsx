import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useShopShowroomCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapCategory = (item) => ({
    id: item.id?.toString(),
    categoryName: item.categoryName || "N/A",
  });

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(`${backendUrl}/shop-showroom-categories/getAllCategories`, {
        headers: { secret_key: secretKey },
      });

      const data = res.data?.data || res.data;
      setCategories(Array.isArray(data) ? data.map(mapCategory) : []);
    } catch (err) {
      console.error("Error fetching categories:", err?.response?.data || err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get category by ID
  const getCategoryById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const res = await axios.get(
        `${backendUrl}/shop-showroom-categories/getCategoryById/${id}`,
        { headers: { secret_key: secretKey } }
      );

      const item = res.data?.data || res.data;
      return mapCategory(item);
    } catch (err) {
      console.error("Error fetching category by ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // Add new category
  const addCategory = useCallback(
    async ({ categoryName }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { categoryName };

        const res = await axios.post(
          `${backendUrl}/shop-showroom-categories/saveCategory`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchCategories();
        return res.data;
      } catch (err) {
        console.error("Error adding category:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchCategories]
  );

  // Update category
  const updateCategory = useCallback(
    async ({ id, categoryName }) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const payload = { categoryName };

        const res = await axios.put(
          `${backendUrl}/shop-showroom-categories/updateCategory/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );

        await fetchCategories();
        return res.data;
      } catch (err) {
        console.error("Error updating category:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchCategories]
  );

  // Delete category
  const deleteCategory = useCallback(
    async (id) => {
      try {
        const secretKey = localStorage.getItem("authToken");
        if (!secretKey) throw new Error("Missing authentication token");

        const res = await axios.delete(
          `${backendUrl}/shop-showroom-categories/deleteCategory/${id}`,
          { headers: { secret_key: secretKey } }
        );

        await fetchCategories();
        return res.data;
      } catch (err) {
        console.error("Error deleting category:", err?.response?.data || err.message);
        throw err;
      }
    },
    [fetchCategories]
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    fetchCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useShopShowroomCategories;

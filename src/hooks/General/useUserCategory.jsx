import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useUserCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    /** MAP API → UI */
    const mapCategory = (item) => ({
        id: item.id?.toString(),
        name: item.categoryName || "",
        code: item.categoryCode || "",
    });

    /** -----------------------------
     * Fetch All User Categories
     ------------------------------*/
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("Missing auth token");

            const res = await axios.get(
                `${backendUrl}/users-category/getAllUsersCategories`,
                { headers: { secret_key: token } }
            );

            // Use res.data directly because API returns an array
            const data = res.data || [];
            setCategories(data.map(mapCategory));
        } catch (err) {
            console.error("Error fetching categories:", err?.response?.data || err.message);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);


    /** -----------------------------
     * Get Category By ID
     ------------------------------*/
    const getCategoryById = useCallback(async (id) => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(
                `${backendUrl}/users-category/getUserCategory/${id}`,
                { headers: { secret_key: token } }
            );
            return mapCategory(res.data?.data || res.data);
        } catch (err) {
            console.error("Error fetching category:", err);
            throw err;
        }
    }, []);

    /** -----------------------------
     * Add Category
     ------------------------------*/
    const addCategory = useCallback(
        async ({ name, code }) => {
            try {
                const token = localStorage.getItem("authToken");
                const payload = { categoryName: name, categoryCode: code };

                const res = await axios.post(
                    `${backendUrl}/users-category/save`,
                    payload,
                    { headers: { secret_key: token } }
                );

                await fetchCategories();
                return res.data;
            } catch (err) {
                console.error("Error adding category:", err);
                throw err;
            }
        },
        [fetchCategories]
    );

    /** -----------------------------
     * Update Category
     ------------------------------*/
    const updateCategory = useCallback(
        async (id, { name, code }) => {
            try {
                const token = localStorage.getItem("authToken");
                const payload = { categoryName: name, categoryCode: code };

                const res = await axios.put(
                    `${backendUrl}/users-category/update/${id}`,
                    payload,
                    { headers: { secret_key: token } }
                );

                await fetchCategories();
                return res.data;
            } catch (err) {
                console.error("Error updating category:", err);
                throw err;
            }
        },
        [fetchCategories]
    );

    /** -----------------------------
     * Delete Category
     ------------------------------*/
    const deleteCategory = useCallback(
        async (id) => {
            try {
                const token = localStorage.getItem("authToken");

                const res = await axios.delete(
                    `${backendUrl}/users-category/delete/${id}`,
                    { headers: { secret_key: token } }
                );

                await fetchCategories();
                return res.data;
            } catch (err) {
                console.error("Error deleting category:", err);
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

export default useUserCategories;

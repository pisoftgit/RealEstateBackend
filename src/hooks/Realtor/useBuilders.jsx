import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";

const useBuilders = () => {
    const [builders, setBuilders] = useState([]);
    const [loading, setLoading] = useState(true);

    const mapBuilder = (item) => ({
        id: item.id?.toString(),
        name: item.name || "",
        headOffice: item.headOffice || "",
        hasAddress: item.hasAddress ?? false,
        websiteURL: item.websiteURL || "",
        description: item.description || "",
        logoContentType: item.logoContentType || "",
        addedById: item.addedById || null,
        businessNatures: item.businessNatures?.map((b) => ({
            id: b.id,
            nature: b.nature,
            code: b.code,
        })) || [],
    })
    
    const getUserId = () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            return userData?.user?.id; 
        } catch {
            return null;
        }
    };


    // Fetch all builders for the user
    const fetchBuilders = useCallback(async () => {
        setLoading(true);
        try {
            const secretKey = localStorage.getItem("authToken");
            const userId = getUserId();
            if (!secretKey || !userId) throw new Error("Missing authentication or userId");

            const res = await axios.get(`${backendUrl}/builders/getAllBuilders/${userId}`, {
                headers: { secret_key: secretKey },
            });

            const data = res.data?.data || res.data;
            setBuilders(Array.isArray(data) ? data.map(mapBuilder) : []);
        } catch (err) {
            console.error("Error fetching builders:", err?.response?.data || err.message);
            setBuilders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get builder by ID
    const getBuilderById = useCallback(async (id) => {
        try {
            const secretKey = localStorage.getItem("authToken");
            if (!secretKey) throw new Error("Missing authentication token");

            const res = await axios.get(`${backendUrl}/builders/getBuilderById/${id}`, {
                headers: { secret_key: secretKey },
            });

            const item = res.data?.data || res.data;
            return mapBuilder(item);
        } catch (err) {
            console.error("Error fetching builder by ID:", err?.response?.data || err.message);
            throw err;
        }
    }, []);

    // Add builder
    const addBuilder = useCallback(async (payload) => {
        try {
            const secretKey = localStorage.getItem("authToken");
            if (!secretKey) throw new Error("Missing authentication token");

            const res = await axios.post(`${backendUrl}/builders/saveBuilder`, payload, {
                headers: { "Content-Type": "application/json", secret_key: secretKey },
            });

            await fetchBuilders();
            return res.data;
        } catch (err) {
            console.error("Error adding builder:", err?.response?.data || err.message);
            throw err;
        }
    }, [fetchBuilders]);

    // Update builder
    const updateBuilder = useCallback(async (id, payload) => {
        try {
            const secretKey = localStorage.getItem("authToken");
            if (!secretKey) throw new Error("Missing authentication token");

            const res = await axios.put(`${backendUrl}/builders/updateBuilder/${id}`, payload, {
                headers: { "Content-Type": "application/json", secret_key: secretKey },
            });

            await fetchBuilders();
            return res.data;
        } catch (err) {
            console.error("Error updating builder:", err?.response?.data || err.message);
            throw err;
        }
    }, [fetchBuilders]);

    // Delete builder
    const deleteBuilder = useCallback(async (id) => {
        try {
            const secretKey = localStorage.getItem("authToken");
            if (!secretKey) throw new Error("Missing authentication token");

            const res = await axios.delete(`${backendUrl}/builders/deleteBuilder/${id}`, {
                headers: { secret_key: secretKey },
            });

            await fetchBuilders();
            return res.data;
        } catch (err) {
            console.error("Error deleting builder:", err?.response?.data || err.message);
            throw err;
        }
    }, [fetchBuilders]);

    useEffect(() => {
        fetchBuilders();
    }, [fetchBuilders]);

    return {
        builders,
        loading,
        fetchBuilders,
        getBuilderById,
        addBuilder,
        updateBuilder,
        deleteBuilder,
    };
};

export default useBuilders;

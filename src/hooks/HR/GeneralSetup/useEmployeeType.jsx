import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const useEmployeeTypeActions = () => {
    const [employeeTypes, setEmployeeTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    /** -------------------------------
     *   Fetch All Employee Types
     * --------------------------------
     */
    const fetchEmployeeTypes = useCallback(async () => {
        setLoading(true);
        try {
            const secretKey = localStorage.getItem("authToken");
            if (!secretKey) throw new Error("Missing authentication token");

            const res = await axios.get(
                `${backendUrl}/employee-type/`,
                { headers: { secret_key: secretKey } }
            );

            const data = res.data?.data || res.data;

            if (Array.isArray(data)) {
                setEmployeeTypes(data.map(item => ({
                    id: item.id.toString(),
                    name: item.employeeType || "N/A",
                    code: item.employeeCodeGenerate.toString(),
                })));
            } else {
                setEmployeeTypes([]);
            }
        } catch (err) {
            console.error("Error fetching employee types:", err?.response?.data || err.message);
            setEmployeeTypes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /** -------------------------------
     *   Add Employee Type
     * --------------------------------
     */
    const addEmployeeType = useCallback(
        async (employeeType, employeeCodeGenerate = false) => {
            try {
                const secretKey = localStorage.getItem("authToken");
                if (!secretKey) throw new Error("Missing authentication token");

                const payload = { employeeType, employeeCodeGenerate };

                const res = await axios.post(
                    `${backendUrl}/employee-type/`,
                    payload,
                    { headers: { "Content-Type": "application/json", secret_key: secretKey } }
                );

                await fetchEmployeeTypes();
                return res.data;
            } catch (err) {
                console.error("Error adding employee type:", err?.response?.data || err.message);
                throw err;
            }
        },
        [fetchEmployeeTypes]
    );

    /** -------------------------------
     *   Update Employee Type
     * --------------------------------
     */
    const updateEmployeeType = useCallback(
        async (id, employeeType, employeeCodeGenerate = false) => {
            try {
                const secretKey = localStorage.getItem("authToken");
                if (!secretKey) throw new Error("Missing authentication token");

                const payload = { employeeType, employeeCodeGenerate };

                const res = await axios.put(
                    `${backendUrl}/employee-type/${id}`,
                    payload,
                    { headers: { "Content-Type": "application/json", secret_key: secretKey } }
                );

                await fetchEmployeeTypes();
                return res.data;
            } catch (err) {
                console.error("Error updating employee type:", err?.response?.data || err.message);
                throw err;
            }
        },
        [fetchEmployeeTypes]
    );

    /** -------------------------------
     *   Delete Employee Type
     * --------------------------------
     */
    const deleteEmployeeType = useCallback(
        async (id) => {
            try {
                const secretKey = localStorage.getItem("authToken");
                if (!secretKey) throw new Error("Missing authentication token");

                const res = await axios.delete(
                    `${backendUrl}/employee-type/${id}`,
                    { headers: { secret_key: secretKey } }
                );

                await fetchEmployeeTypes();
                return res.data;
            } catch (err) {
                console.error("Error deleting employee type:", err?.response?.data || err.message);
                throw err;
            }
        },
        [fetchEmployeeTypes]
    );

    /** -------------------------------
     *   Fetch on Mount
     * --------------------------------
     */
    useEffect(() => {
        fetchEmployeeTypes();
    }, [fetchEmployeeTypes]);

    return {
        employeeTypes,
        loading,
        fetchEmployeeTypes,
        addEmployeeType,
        updateEmployeeType,
        deleteEmployeeType,
    };
};

export default useEmployeeTypeActions;

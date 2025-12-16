import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";
import { toast } from "react-toastify";

const useDistrictManagement = () => {
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedStateId, setSelectedStateId] = useState(null);

    // Fetch districts by state ID
    const fetchDistrictsByStateId = useCallback(async (stateId) => {
        if (!stateId) return;
        setLoading(true);
        try {
            const secretKey = localStorage.getItem("authToken");

            const response = await axios.get(
                `${backendUrl}/district/state/${stateId}`,
                { headers: { secret_key: secretKey } }
            );

            setDistricts(response.data);
        } catch (err) {
            const msg = err?.response?.data?.message || err.message;
            toast.error(msg);
            setError(msg);
            setDistricts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDistrictsByStateId(selectedStateId);
    }, [selectedStateId]);

    // Add district
    const addDistrict = async (districtName, districtCode, selectedState, selectedCountry) => {
        try {
            const secretKey = localStorage.getItem("authToken");

            const payload = {
                district: districtName,
                districtCode,
                state: {
                    id: selectedState,
                    state: "",
                    stateCode: "",
                    country: {
                        id: selectedCountry,
                        country: "",
                        countryCode: ""
                    }
                }
            };

            await axios.post(`${backendUrl}/district/save`, payload, {
                headers: { secret_key: secretKey }
            });

            toast.success("District added successfully!");

            fetchDistrictsByStateId(selectedState);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to add district");
            throw err;
        }
    };

    // Update district
    const updateDistrict = async (districtId, districtName, districtCode, selectedState, selectedCountry) => {
        try {
            const secretKey = localStorage.getItem("authToken");

            const payload = {
                district: districtName,
                districtCode,
                state: {
                    id: selectedState,
                    state: "",
                    stateCode: "",
                    country: {
                        id: selectedCountry,
                        country: "",
                        countryCode: ""
                    }
                }
            };

            await axios.put(`${backendUrl}/district/update/${districtId}`, payload, {
                headers: { secret_key: secretKey }
            });

            toast.success("District updated successfully!");

            fetchDistrictsByStateId(selectedStateId);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update district");
            throw err;
        }
    };

    // Delete district
    const deleteDistrict = async (id) => {
        try {
            const secretKey = localStorage.getItem("authToken");

            await axios.delete(`${backendUrl}/district/delete/${id}`, {
                headers: { secret_key: secretKey }
            });

            toast.success("District deleted successfully!");

            fetchDistrictsByStateId(selectedStateId);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete district");
            throw err;
        }
    };

    return {
        districts,
        loading,
        error,
        addDistrict,
        updateDistrict,
        deleteDistrict,
        setSelectedStateId,
    };
};

export default useDistrictManagement;

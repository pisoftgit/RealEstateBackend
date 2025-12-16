import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../ProtectedRoutes/api";

const useOrganization = () => {
    const [organization, setOrganization] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // Convert file to Base64
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result.split(",")[1]); // Remove prefix
            reader.onerror = (error) => reject(error);

            reader.readAsDataURL(file);
        });
    };

    // Fetch organization details
    const getOrganization = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");

            const res = await axios.get(
                `${backendUrl}/organization/getOrganization`,
                {
                    headers: { secret_key: token }
                }
            );

            setOrganization(res.data);
        } catch (err) {
            toast.error("Failed to load organization info.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch organization logo
    // Fetch organization logo
    const getOrganizationLogo = useCallback(async () => {
        try {
            const token = localStorage.getItem("authToken");

            const res = await axios.get(
                `${backendUrl}/organization/getOrganizationLogo`,
                { headers: { secret_key: token } }
            );

            const byteData = res.data;

            if (!byteData) {
                setLogoUrl(null);
                return;
            }

            // Convert raw byte/base64 into a displayable image
            const base64String = typeof byteData === "string" ? byteData : "";

            // Detect file type — fallback JPEG
            const mimeType = base64String.startsWith("/") || base64String.startsWith("iV")
                ? "image/png"
                : "image/jpeg";

            const finalImage = `data:${mimeType};base64,${base64String}`;

            setLogoUrl(finalImage);
        } catch (err) {
            console.log("Logo fetch error:", err);
        }
    }, []);

    // Save organization
    const saveOrganization = async (formData) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");

            let logoBase64 = "";

            // If user uploaded a logo → convert to Base64
            if (formData.logo instanceof File) {
                logoBase64 = await convertFileToBase64(formData.logo);
            }

            const payload = {
                name: formData.name,
                officeNo: formData.officeNo,
                contactNo: formData.contactNo,
                gstNo: formData.gstNo,
                email: formData.email,
                webSite: formData.website,
                logoString: logoBase64,
                organizationCode: formData.orgCode,
            };

            await axios.post(
                `${backendUrl}/organization/save`,
                payload,
                {
                    headers: { secret_key: token }
                }
            );

            toast.success("Organization saved successfully!");

            // Refresh data
            getOrganization();
            getOrganizationLogo();

        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to save organization";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrganization();
        getOrganizationLogo();
    }, []);

    return {
        organization,
        logoUrl,
        loading,
        saveOrganization,
        getOrganization,
        getOrganizationLogo,
    };
};

export default useOrganization;

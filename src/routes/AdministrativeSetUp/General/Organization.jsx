import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSave, FiEdit, FiPlus, FiUploadCloud } from "react-icons/fi";
import { FaUndo } from "react-icons/fa";
import { toast } from "react-toastify";

import useOrganization from "../../../hooks/General/useOrganization";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const OrganizationSetupPage = () => {
  const { organization, logoUrl, saveOrganization, deleteOrganization, loading } =
    useOrganization();

  const [formEnabled, setFormEnabled] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    officeNo: "",
    email: "",
    gstNo: "",
    contactNo: "",
    website: "",
    orgCode: "",
    logo: null,
  });

  // Load organization when API returns it
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        officeNo: organization.officeNo || "",
        email: organization.email || "",
        gstNo: organization.gstNo || "",
        contactNo: organization.contactNo || "",
        website: organization.webSite || "",
        orgCode: organization.organizationCode || "",
        logo: null,
      });

      setFormEnabled(false); // Disable form initially
    } else {
      // No organization exists → allow adding
      setFormEnabled(true);
    }
  }, [organization]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleReset = () => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        officeNo: organization.officeNo || "",
        email: organization.email || "",
        gstNo: organization.gstNo || "",
        contactNo: organization.contactNo || "",
        website: organization.webSite || "",
        orgCode: organization.organizationCode || "",
        logo: null,
      });

      toast.info("Form reset to saved values.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveOrganization(formData);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete the organization?")) {
      deleteOrganization();
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-500 font-dm"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header section */}
        <div className="flex font-dm justify-between items-center mb-6">
          <h1 className="text-3xl font-dm font-bold text-blue-950 dark:text-white">
            Organization Setup
          </h1>

          {/* Only show Add New Button if NO organization exists */}
          {!organization && (
            <button
              onClick={() => setFormEnabled(true)}
              className="flex items-center font-dm px-4 py-2 bg-blue-950 text-white rounded-lg shadow hover:bg-blue-700"
            >
              <FiPlus className="mr-2" /> Add New Organization
            </button>
          )}
        </div>

        <motion.div
          className="p-5 rounded-2xl shadow-xl font-dm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* If organization exists, show UPDATE + DELETE buttons */}
          {organization && (
            <div className="flex justify-end mb-5 gap-3">
              <button
                onClick={() => setFormEnabled(true)}
                className="flex items-center font-dm px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-yellow-500"
              >
                <FiEdit className="mr-1" /> Update
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Form grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* NAME */}
              <InputField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!formEnabled}
                required
              />

              <InputField
                label="Office No."
                name="officeNo"
                value={formData.officeNo}
                onChange={handleInputChange}
                disabled={!formEnabled}
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!formEnabled}
              />

              <InputField
                label="GST No."
                name="gstNo"
                value={formData.gstNo}
                onChange={handleInputChange}
                disabled={!formEnabled}
              />

              <InputField
                label="Contact No."
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                disabled={!formEnabled}
              />

              <InputField
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                disabled={!formEnabled}
              />

              <InputField
                label="Org Code"
                name="orgCode"
                value={formData.orgCode}
                onChange={handleInputChange}
                disabled={!formEnabled}
              />

              {/* LOGO UPLOAD */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-dm ">
                  Logo
                </label>
                <div className="flex flex-row gap-2 justify-center items-center">

                  <FiUploadCloud className="text-blue-950 mr-3" size={25} />

                  <input
                    type="file"
                    disabled={!formEnabled}
                    onChange={handleFileChange}
                    className="w-full p-3 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* EXISTING LOGO */}
                {logoUrl && !formData.logo && (
                  <img src={logoUrl} alt="Organization Logo" className="h-20 mt-3" />
                )}

                {/* NEW LOGO PREVIEW */}
                {formData.logo && (
                  <img
                    src={URL.createObjectURL(formData.logo)}
                    alt="Preview"
                    className="h-20 mt-3"
                  />
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            {formEnabled && (
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400"
                >
                  <FaUndo className="mr-1" /> Reset
                </button>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-700"
                >
                  <FiSave className="mr-1" />
                  {loading ? "Saving..." : organization ? "Update" : "Save"}
                </motion.button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Reusable input field
const InputField = ({ label, name, value, onChange, disabled, type = "text", required }) => (
  <div>
    <label className="block text-blue-950 dark:text-gray-300 mb-2 font-bold">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-blue-900 dark:text-white 
      ${disabled ? "opacity-80 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-600"}
      `}
    />
  </div>
);

export default OrganizationSetupPage;

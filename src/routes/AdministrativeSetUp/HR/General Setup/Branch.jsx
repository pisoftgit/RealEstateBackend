import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit2, FiSave, FiXCircle, FiUploadCloud, FiMapPin, FiGlobe, FiLayers, FiBriefcase, FiUserCheck, FiDollarSign, FiLoader } from "react-icons/fi";
import axios from "axios";
import useBranchActions from "../../../../hooks/HR/GeneralSetup/useBranchHook";
import { backendUrl } from "../../../../ProtectedRoutes/api";
import useCountry from "../../../../hooks/General/useCountry";
import useStateManagement from "../../../../hooks/General/useStateManage";
import useDistrictManagement from "../../../../hooks/General/useDistrictManage";

// Reusable Input/Select Field
const FormField = ({ label, name, value, onChange, type = "text", children, disabled = false, required = false }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {type === "select" ? (
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm"
      >
        {children}
      </select>
    ) : (
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm"
      />
    )}
  </div>
);

// Section Title Component
const SectionTitle = ({ icon: Icon, title }) => (
  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 border-b pb-2 mb-4 flex items-center gap-2">
    <Icon className="w-5 h-5" />
    {title}
  </h3>
);

const ConfigureBranch = () => {
  const { branches, loading, addBranch, updateBranch, deleteBranch } = useBranchActions();

  const { countries, loading: countryLoading } = useCountry();
  const { states, loading: stateLoading, setSelectedCountryId } = useStateManagement();
  const { districts, loading: districtLoading, setSelectedStateId } = useDistrictManagement();

  const [organizations, setOrganizations] = useState([]);
  const [orgLoading, setOrgLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 

  const [editingBranchId, setEditingBranchId] = useState(null);

  const [branchData, setBranchData] = useState({
    organizationId: "",
    branch: "",
    countryId: "",
    stateId: "",
    districtId: "",
    address1: "",
    address2: "",
    city: "",
    pincode: "",
    gstApplicable: "No",
    gstNo: "",
    authorizedPersonName: "",
    authorizedPersonContact: "",
    authorizedPersonEmail: "",
    authorizedPersonDesignation: "",
    authorizedSignatureLogo: null, // File object for upload
    existingLogo: "", // Base64 string from backend
    authorizedSignatureLogoContentType: "",
  });

  /** Fetch Organizations (Logic remains same) */
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setOrgLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Missing auth token");

        const res = await axios.get(`${backendUrl}/organization/getOrganization`, {
          headers: { secret_key: token },
        });

        const orgData = res.data?.data || res.data;
        setOrganizations(Array.isArray(orgData) ? orgData : [orgData]);
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
        setOrganizations([]);
      } finally {
        setOrgLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  /** Handle Input Change (Logic remains same) */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setBranchData((prev) => ({
      ...prev,
      [name]: name === "authorizedSignatureLogo" ? files[0] : value,
      ...(name === "gstApplicable" && value === "No" ? { gstNo: "" } : {}),
      // Automatically set content type for image uploads (simple guess)
      ...(name === "authorizedSignatureLogo" && files.length > 0
        ? { authorizedSignatureLogoContentType: files[0].type || "image/png" }
        : {}),
    }));

    if (name === "countryId") {
      setSelectedCountryId(value);
      setBranchData((prev) => ({ ...prev, stateId: "", districtId: "" }));
    }
    if (name === "stateId") {
      setSelectedStateId(value);
      setBranchData((prev) => ({ ...prev, districtId: "" }));
    }
  };

  /** Reset Form (Logic remains same) */
  const resetForm = () => {
    setBranchData({
      organizationId: "",
      branch: "",
      countryId: "",
      stateId: "",
      districtId: "",
      address1: "",
      address2: "",
      city: "",
      pincode: "",
      gstApplicable: "No",
      gstNo: "",
      authorizedPersonName: "",
      authorizedPersonContact: "",
      authorizedPersonEmail: "",
      authorizedPersonDesignation: "",
      authorizedSignatureLogo: null,
      existingLogo: "",
      authorizedSignatureLogoContentType: "",
    });
    setEditingBranchId(null);
    const fileInput = document.querySelector('input[name="authorizedSignatureLogo"]');
    if (fileInput) fileInput.value = "";
  };


  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (err) => reject(err);
    });


  const handleAddOrUpdateBranch = async (e) => {
    e.preventDefault();
    if (!branchData.branch || !branchData.organizationId) return;

    setIsSaving(true);
    try {
      let logoBase64 = "";
      // Only process a new file if one is selected
      if (branchData.authorizedSignatureLogo && branchData.authorizedSignatureLogo instanceof File) {
        logoBase64 = await getBase64(branchData.authorizedSignatureLogo);
      }
      
      // Use existing base64 if no new file is selected and we are editing
      const finalLogoBase64 = logoBase64 || (editingBranchId && !branchData.authorizedSignatureLogo ? branchData.existingLogo : null);

      const payload = {
        branch: branchData.branch,
        organizationId: Number(branchData.organizationId),
        gstApplicable: branchData.gstApplicable === "Yes",
        gstNo: branchData.gstNo,
        organisatonAddressDetails: {
          districtId: branchData.districtId ? Number(branchData.districtId) : null,
          address1: branchData.address1,
          address2: branchData.address2,
          city: branchData.city,
          pincode: branchData.pincode,
        },
        authorizedPersonName: branchData.authorizedPersonName,
        authorizedPersonContact: branchData.authorizedPersonContact,
        authorizedPersonEmail: branchData.authorizedPersonEmail,
        authorizedPersonDesignation: branchData.authorizedPersonDesignation,
        authorizedSignatureLogo: finalLogoBase64,
        authorizedSignatureLogoContentType: finalLogoBase64 ? (branchData.authorizedSignatureLogoContentType || "image/png") : null
      };

      if (editingBranchId) {
        // Optimistically trigger update/add actions from the hook (or directly call API if hook doesn't exist)
        await updateBranch(editingBranchId, payload); 
      } else {
        await addBranch(payload);
      }

      resetForm();
    } catch (err) {
      console.error("Failed to save branch:", err);
      // In a real app, you would show a user-facing error message here
    } finally {
      setIsSaving(false);
    }
  };


  const handleEdit = (branch) => {
    // Logic remains the same, but ensure state selection logic is robust for edit
    setEditingBranchId(branch.id);
    setBranchData({
      organizationId: branch.organizationId || "",
      branch: branch.branch || "",
      countryId: branch.organisationAddressDetails?.countryId || "",
      stateId: branch.organisationAddressDetails?.stateId || "",
      districtId: branch.organisationAddressDetails?.districtId || "",
      address1: branch.organisationAddressDetails?.address1 || "",
      address2: branch.organisationAddressDetails?.address2 || "",
      city: branch.organisationAddressDetails?.city || "",
      pincode: branch.organisationAddressDetails?.pincode || "",
      gstApplicable: branch.gstApplicable ? "Yes" : "No",
      gstNo: branch.gstNo || "",
      authorizedPersonName: branch.authorizedPersonName || "",
      authorizedPersonContact: branch.authorizedPersonContact || "",
      authorizedPersonEmail: branch.authorizedPersonEmail || "",
      authorizedPersonDesignation: branch.authorizedPersonDesignation || "",
      authorizedSignatureLogo: null, // Clear file input on edit load
      existingLogo: branch.authorizedSignatureLogo || "",
      authorizedSignatureLogoContentType: branch.authorizedSignatureLogoContentType || "image/png",
    });

    // Ensure dependent states (State/District) are loaded correctly for the form
    // The hooks should handle fetching based on countryId and stateId being set.
    if (branch.organisationAddressDetails?.countryId) {
      setSelectedCountryId(branch.organisationAddressDetails.countryId);
    } else {
      setSelectedCountryId("");
    }
    if (branch.organisationAddressDetails?.stateId) {
      setSelectedStateId(branch.organisationAddressDetails.stateId);
    } else {
      setSelectedStateId("");
    }
  };

  /** Delete Branch (Logic remains same) */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      await deleteBranch(id);
    }
  };


  const renderImage = () => {
    if (branchData.authorizedSignatureLogo) {
      // New file selected - show local preview
      return <img src={URL.createObjectURL(branchData.authorizedSignatureLogo)} alt="New Logo Preview" className="w-24 h-24 object-contain rounded-lg border border-blue-400 dark:border-blue-600 p-1 bg-gray-100 dark:bg-gray-700" />;
    }
    if (branchData.existingLogo) {
      // Existing logo from the backend
      const mime = branchData.authorizedSignatureLogoContentType || "image/png";
      return <img src={`data:${mime};base64,${branchData.existingLogo}`} alt="Existing Logo" className="w-24 h-24 object-contain rounded-lg border border-gray-300 dark:border-gray-600 p-1 bg-gray-100 dark:bg-gray-700" />;
    }
    return <div className="w-24 h-24 flex items-center justify-center text-gray-500 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-700/50"><FiUploadCloud className="w-6 h-6" /></div>;
  };

  const getOrganizationName = (id) => {
    const org = organizations.find(o => o.id === id);
    return org ? (org.name || org.organizationName) : "N/A";
  }

  return (
    <motion.div 
      className="min-h-screen p-4 sm:p-8 bg-gray-100 font-dm dark:bg-gray-900 transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Branch Form */}
        <motion.div 
          className="p-6 sm:p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700"
          layout
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
            <FiLayers className="mr-3 w-6 h-6 text-blue-500" />
            {editingBranchId ? "Edit Existing Branch" : "Add New Organizational Branch"}
          </h2>

          <form onSubmit={handleAddOrUpdateBranch} className="space-y-8">

            {/* General Branch Details */}
            <fieldset className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
              <legend className="text-base font-semibold px-2 text-blue-600 dark:text-blue-400">Branch Identity</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  label="Organization" 
                  name="organizationId" 
                  value={branchData.organizationId} 
                  onChange={handleChange} 
                  type="select"
                  required
                >
                  <option value="" disabled>---Select Organization---</option>
                  {orgLoading ? (
                    <option disabled>Loading Organizations...</option>
                  ) : (
                    organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name || org.organizationName}
                      </option>
                    ))
                  )}
                </FormField>

                <FormField 
                  label="Branch Name" 
                  name="branch" 
                  value={branchData.branch} 
                  onChange={handleChange} 
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormField 
                  label="GST Applicable?" 
                  name="gstApplicable" 
                  value={branchData.gstApplicable} 
                  onChange={handleChange} 
                  type="select"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </FormField>

                <FormField 
                  label="GST No" 
                  name="gstNo" 
                  value={branchData.gstNo} 
                  onChange={handleChange} 
                  disabled={branchData.gstApplicable === "No"}
                />
              </div>
            </fieldset>

            {/* Location Details */}
            <fieldset className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
              <legend className="text-base font-semibold px-2 text-blue-600 dark:text-blue-400">Location and Address</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField 
                  label="Country" 
                  name="countryId" 
                  value={branchData.countryId} 
                  onChange={handleChange} 
                  type="select"
                >
                  <option value="">---Select Country---</option>
                  {countryLoading
                    ? <option disabled>Loading Countries...</option>
                    : countries.map((c) => (
                      <option key={c.id} value={c.id}>{c.country}</option>
                    ))}
                </FormField>

                <FormField 
                  label="State" 
                  name="stateId" 
                  value={branchData.stateId} 
                  onChange={handleChange} 
                  type="select"
                  disabled={!branchData.countryId}
                >
                  <option value="">---Select State---</option>
                  {stateLoading
                    ? <option disabled>Loading States...</option>
                    : states.map((s) => (
                      <option key={s.id} value={s.id}>{s.state}</option>
                    ))}
                </FormField>

                <FormField 
                  label="District" 
                  name="districtId" 
                  value={branchData.districtId} 
                  onChange={handleChange} 
                  type="select"
                  disabled={!branchData.stateId}
                >
                  <option value="">---Select District---</option>
                  {districtLoading
                    ? <option disabled>Loading Districts...</option>
                    : districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.district}</option>
                    ))}
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  label="Address Line 1" 
                  name="address1" 
                  value={branchData.address1} 
                  onChange={handleChange} 
                />
                <FormField 
                  label="Address Line 2 (Optional)" 
                  name="address2" 
                  value={branchData.address2} 
                  onChange={handleChange} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  label="City/Town" 
                  name="city" 
                  value={branchData.city} 
                  onChange={handleChange} 
                />
                <FormField 
                  label="Pincode/Zip" 
                  name="pincode" 
                  value={branchData.pincode} 
                  onChange={handleChange} 
                />
              </div>
            </fieldset>

            {/* Authorized Person & Signature */}
            <fieldset className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
              <legend className="text-base font-semibold px-2 text-blue-600 dark:text-blue-400">Authorized Contact</legend>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  label="Authorized Person Name" 
                  name="authorizedPersonName" 
                  value={branchData.authorizedPersonName} 
                  onChange={handleChange} 
                />
                <FormField 
                  label="Authorized Person Designation" 
                  name="authorizedPersonDesignation" 
                  value={branchData.authorizedPersonDesignation} 
                  onChange={handleChange} 
                />
                <FormField 
                  label="Authorized Person Contact" 
                  name="authorizedPersonContact" 
                  value={branchData.authorizedPersonContact} 
                  onChange={handleChange} 
                />
                <FormField 
                  label="Authorized Person Email" 
                  name="authorizedPersonEmail" 
                  value={branchData.authorizedPersonEmail} 
                  onChange={handleChange} 
                  type="email"
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex-shrink-0">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Signature / Logo Preview:</label>
                    {renderImage()}
                </div>
                <div className="flex-grow w-full">
                    <label htmlFor="authorizedSignatureLogo" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Upload Signature / Branch Logo (Optional)</label>
                    <input
                        id="authorizedSignatureLogo"
                        type="file"
                        name="authorizedSignatureLogo"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800 transition duration-150"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Upload a new image to replace the existing one.</p>
                </div>
              </div>
            </fieldset>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button 
                type="button" 
                onClick={resetForm} 
                disabled={isSaving}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 flex items-center gap-2 shadow-md"
              >
                <FiXCircle /> 
                Cancel / Reset
              </button>
              <button 
                type="submit" 
                disabled={isSaving}
                className="px-6 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-700 transition duration-150 flex items-center gap-2 shadow-lg disabled:bg-blue-400"
              >
                {isSaving ? (
                    <>
                        <FiLoader className="animate-spin" /> Saving...
                    </>
                ) : editingBranchId ? (
                    <>
                        <FiSave /> Update Branch
                    </>
                ) : (
                    <>
                        <FiPlus /> Add Branch
                    </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Branch List Table */}
        <motion.div className="p-6 sm:p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 overflow-x-auto border border-blue-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
            <FiMapPin className="mr-3 w-6 h-6 text-blue-500" />
            Existing Branches <span className="text-blue-500 ml-2">({branches.length})</span>
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-10 text-blue-600 dark:text-blue-400">
                <FiLoader className="animate-spin w-8 h-8 mr-3" />
                <p className="text-lg">Loading organizational branches...</p>
            </div>
          ) : branches.length === 0 ? (
            <p className="text-center text-gray-500 py-10 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-700/50">No branches found. Start by adding a new branch above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-blue-950 dark:bg-blue-800 text-white shadow-md">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-tl-lg">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Branch Code</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Branch Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Organization</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">GST</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider rounded-tr-lg">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {branches.map((b, i) => {
                      const mime = b.authorizedSignatureLogoContentType || "image/png";
                      return (
                        <motion.tr
                          key={b.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{i + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{b.branchCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{b.branch}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                                {getOrganizationName(b.organizationId)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {b.branchPic ? (
                              <img
                                src={`data:${mime};base64,${b.branchPic}`}
                                alt="Branch"
                                className="w-12 h-12 object-contain rounded border inline-block"
                              />
                            ) : (
                              <FiBriefcase className="w-6 h-6 text-gray-400 mx-auto" />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${b.gstApplicable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                              {b.gstApplicable ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEdit(b)}
                                className="p-2 text-blue-600 border border-blue-200 rounded-full hover:bg-blue-100 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900 transition duration-150"
                                title="Edit Branch"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(b.id)}
                                className="p-2 text-red-600 border border-red-200 rounded-full hover:bg-red-100 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900 transition duration-150"
                                title="Delete Branch"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConfigureBranch;
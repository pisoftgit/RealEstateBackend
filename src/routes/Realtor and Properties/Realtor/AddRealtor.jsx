import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiUploadCloud, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

// Hooks
import useBusinessNatureActions from "../../../hooks/propertyConfig/BusinessNaturehook";
import useCountry from "../../../hooks/General/useCountry";
import useStateManagement from "../../../hooks/General/useStateManage";
import useDistrictManagement from "../../../hooks/General/useDistrictManage";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export default function AddRealtor() {
  // Hooks
  const { businessNatures } = useBusinessNatureActions();
  const { countries } = useCountry();
  const {
    states,
    setSelectedCountryId,
  } = useStateManagement();
  const {
    districts,
    setSelectedStateId,
  } = useDistrictManagement();

  const [logoPreview, setLogoPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email:"",
    headOffice: "",
    websiteURL: "",
    description: "",
    logoFile: null,
    businessNature: [],
    addAddress: false,
    address: {
      address1: "",
      address2: "",
      city: "",
      pincode: "",
      districtId: "",
      stateId: "",
      countryId: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, checked, files } = e.target;

    if (name === "logoFile") {
      const file = files[0];
      setForm((prev) => ({ ...prev, logoFile: file }));

      // Preview Image
      setLogoPreview(URL.createObjectURL(file));
      return;
    }

    if (name === "businessNature") {
      const updated = checked
        ? [...form.businessNature, value]
        : form.businessNature.filter((id) => id !== value);
      setForm((prev) => ({ ...prev, businessNature: updated }));
      return;
    }

    if (name === "addAddress") {
      setForm((prev) => ({ ...prev, addAddress: value === "Yes" }));
      return;
    }

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      const newAddress = { ...form.address, [key]: value };

      // COUNTRY SELECTED → LOAD STATES
      if (key === "countryId") {
        setSelectedCountryId(value);
        newAddress.stateId = "";
        newAddress.districtId = "";
      }

      // STATE SELECTED → LOAD DISTRICTS
      if (key === "stateId") {
        setSelectedStateId(value);
        newAddress.districtId = "";
      }

      setForm((prev) => ({ ...prev, address: newAddress }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const secretKey = localStorage.getItem("authToken");
      let base64Logo = "";

      if (form.logoFile)
        base64Logo = await convertFileToBase64(form.logoFile);

      const payload = {
        name: form.name,
        email:form.email,
        headOffice: form.headOffice,
        hasAddress: form.addAddress,
        websiteURL: form.websiteURL,
        description: form.description,
        logoContentType: form.logoFile ? form.logoFile.type : "",
        logoString: base64Logo,
        businessNatureIds: form.businessNature.map((x) => Number(x)),
        addedById: 1,

        ...(form.addAddress && {
          addressType: "Office",
          address1: form.address.address1,
          address2: form.address.address2,
          city: form.address.city,
          pincode: form.address.pincode,
          districtId: Number(form.address.districtId),
          stateId: Number(form.address.stateId),
          countryId: Number(form.address.countryId),
        }),
      };

      await axios.post(`${backendUrl}/builders/saveBuilder`, payload, {
        headers: { "Content-Type": "application/json", secret_key: secretKey },
      });

      alert("Realtor saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save Realtor");
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 font-dm"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-3xl font-bold text-blue-950 dark:text-white mb-10 ml-3"
        variants={itemVariants}
      >
        Add Realtor Partner
      </motion.h1>

      <motion.div
        className="max-w-4xl mx-auto p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-800"
        variants={itemVariants}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BUSINESS NATURE */}
          <motion.div variants={itemVariants}>
            <label className="block text-xl font-bold mb-4">Business Nature *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {businessNatures.map((bn) => (
                <label
                  key={bn.id}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer ${form.businessNature.includes(bn.id.toString())
                    ? "bg-blue-950 text-white"
                    : "bg-gray-100 dark:bg-gray-700"
                    }`}
                >
                  <input
                    type="checkbox"
                    name="businessNature"
                    value={bn.id}
                    checked={form.businessNature.includes(bn.id.toString())}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  {bn.name}
                </label>
              ))}
            </div>
          </motion.div>

          {/* Name */}
          <motion.div variants={itemVariants}>
            <label className="font-semibold block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="font-semibold block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </motion.div>

          {/* HEAD OFFICE */}
          <motion.div variants={itemVariants}>
            <label className="font-semibold block mb-2">Head Office</label>
            <input
              type="text"
              name="headOffice"
              value={form.headOffice}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </motion.div>

          {/* WEBSITE URL */}
          <motion.div variants={itemVariants}>
            <label className="font-semibold block mb-2">Website URL</label>
            <input
              type="text"
              name="websiteURL"
              value={form.websiteURL}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </motion.div>

          {/* DESCRIPTION */}
          <motion.div variants={itemVariants}>
            <label className="font-semibold block mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              rows="3"
            />
          </motion.div>

          {/* LOGO UPLOAD */}
          <motion.div variants={itemVariants}>
            <label className="font-bold block mb-3">Upload Logo</label>
            <label className="flex p-4 border-2 border-dashed rounded-xl cursor-pointer bg-gray-100">
              <FiUploadCloud className="text-blue-600 mr-3" />
              <span>{form.logoFile ? form.logoFile.name : "Choose Logo File"}</span>
              <input
                type="file"
                name="logoFile"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>

            {/* Logo Preview */}
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="h-20 mt-3 rounded shadow"
              />
            )}
          </motion.div>

          {/* ADDRESS OPTION */}
          <motion.div variants={itemVariants}>
            <label className="font-bold block mb-2">Include Address Details?</label>
            <div className="flex gap-6">
              <label>
                <input type="radio" name="addAddress" value="Yes" onChange={handleChange} /> Yes
              </label>
              <label>
                <input type="radio" name="addAddress" value="No" onChange={handleChange} /> No
              </label>
            </div>
          </motion.div>

          {/* ADDRESS FORM */}
          <AnimatePresence>
            {form.addAddress && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-5 border rounded-xl bg-blue-50"
              >
                <legend className="font-bold mb-4">
                  <FiMapPin className="inline mr-2" /> Address Details
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* COUNTRY */}
                  <select
                    name="address.countryId"
                    onChange={handleChange}
                    className="p-3 border rounded-lg"
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>{c.country}</option>
                    ))}
                  </select>

                  {/* STATE */}
                  <select
                    name="address.stateId"
                    onChange={handleChange}
                    disabled={!form.address.countryId}
                    className="p-3 border rounded-lg"
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>{s.state}</option>
                    ))}
                  </select>

                  {/* DISTRICT */}
                  <select
                    name="address.districtId"
                    onChange={handleChange}
                    disabled={!form.address.stateId}
                    className="p-3 border rounded-lg"
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.district}</option>
                    ))}
                  </select>

                  <input name="address.address1" placeholder="Address Line 1" onChange={handleChange} className="p-3 border rounded-lg" />
                  <input name="address.address2" placeholder="Address Line 2" onChange={handleChange} className="p-3 border rounded-lg" />
                  <input name="address.city" placeholder="City" onChange={handleChange} className="p-3 border rounded-lg" />
                  <input name="address.pincode" placeholder="Pincode" onChange={handleChange} className="p-3 border rounded-lg" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUBMIT BUTTON */}
          <motion.button
            type="submit"
            className="w-full py-4 rounded-xl bg-blue-950 text-white font-bold"
          >
            <FiCheckCircle className="inline mr-2" /> Submit Registration
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

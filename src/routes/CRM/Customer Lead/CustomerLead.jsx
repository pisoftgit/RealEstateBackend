import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiSave, FiRotateCcw } from "react-icons/fi";

// Themed utility classes based on your reference style
const inputClass =
  "w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm";
const labelClass =
  "block font-medium mb-1 text-gray-700 dark:text-gray-300 text-sm";
const sectionClass =
  "p-5 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700";

const CustomerLeadDetails = () => {
  const [lead, setLead] = useState({
    leadDate: "",
    leadSource: "",
    prefix: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    mobile: "",
    email: "",
    fatherPrefix: "",
    fatherName: "",
    motherPrefix: "",
    motherName: "",
    dob: "",
    hasAddress: false,
    address: {
      country: "",
      state: "",
      district: "",
      city: "",
      line1: "",
      line2: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLead((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressChange = (e, field) => {
    const { value } = e.target;
    setLead((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Lead Details:", lead);
    alert("Lead details submitted successfully!");
  };

  const handleReset = () => {
    setLead({
      leadDate: "",
      leadSource: "",
      prefix: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      mobile: "",
      email: "",
      fatherPrefix: "",
      fatherName: "",
      motherPrefix: "",
      motherName: "",
      dob: "",
      hasAddress: false,
      address: {
        country: "",
        state: "",
        district: "",
        city: "",
        line1: "",
        line2: "",
      },
    });
  };

  return (
    <motion.div
      // Adopted the main container style from the reference
      className="min-h-screen p-6 font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-3xl font-bold mb-8 text-blue-950 dark:text-white flex items-center">
          <FiUserPlus className="mr-3 text-blue-600 dark:text-blue-400" /> Customer Lead Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Lead Info Section */}
          <div className={sectionClass}>
            <h3 className="text-xl font-bold mb-4 text-blue-950 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Lead Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Lead Generation Date *</label>
                <input
                  type="date"
                  name="leadDate"
                  value={lead.leadDate}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Lead Generated From</label>
                <select
                  name="leadSource"
                  value={lead.leadSource}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">--- Select Source ---</option>
                  <option value="Walk In">Walk In</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
            </div>
          </div>

          {/* Personal Info Section */}
          <div className={sectionClass}>
            <h3 className="text-xl font-bold mb-4 text-blue-950 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Row 1: Name and Prefix */}
              <div>
                <label className={labelClass}>Prefix</label>
                <select
                  name="prefix"
                  value={lead.prefix}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">--- Prefix ---</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={lead.firstName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={lead.middleName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={lead.lastName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Row 2: Contact and DOB */}
              <div>
                <label className={labelClass}>Gender *</label>
                <select
                  name="gender"
                  value={lead.gender}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">--- Select ---</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Mobile No *</label>
                <input
                  type="text"
                  name="mobile"
                  value={lead.mobile}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email ID</label>
                <input
                  type="email"
                  name="email"
                  value={lead.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>DOB</label>
                <input
                  type="date"
                  name="dob"
                  value={lead.dob}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Row 3: Parents' Names */}
              <div className="col-span-1">
                <label className={labelClass}>Father's Prefix</label>
                <select
                  name="fatherPrefix"
                  value={lead.fatherPrefix}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">--- Prefix ---</option>
                  <option value="Mr.">Mr.</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className={labelClass}>Father's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={lead.fatherName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="col-span-1">
                <label className={labelClass}>Mother's Prefix</label>
                <select
                  name="motherPrefix"
                  value={lead.motherPrefix}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">--- Prefix ---</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className={labelClass}>Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={lead.motherName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className={sectionClass}>
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              <h3 className="text-xl font-bold text-blue-950 dark:text-white">
                Address Details
              </h3>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Address Available?
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    name="hasAddress"
                    checked={lead.hasAddress}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 rounded"
                  />
                  <span>{lead.hasAddress ? "Yes" : "No"}</span>
                </label>
              </div>
            </div>

            <motion.div
              // Use Framer Motion for a smooth entry/exit of the address fields
              initial={false}
              animate={{ height: lead.hasAddress ? "auto" : 0, opacity: lead.hasAddress ? 1 : 0 }}
              style={{ overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className={labelClass}>Country *</label>
                  <input
                    type="text"
                    value={lead.address.country}
                    onChange={(e) => handleAddressChange(e, "country")}
                    className={inputClass}
                    required={lead.hasAddress}
                    disabled={!lead.hasAddress}
                  />
                </div>
                <div>
                  <label className={labelClass}>State *</label>
                  <input
                    type="text"
                    value={lead.address.state}
                    onChange={(e) => handleAddressChange(e, "state")}
                    className={inputClass}
                    required={lead.hasAddress}
                    disabled={!lead.hasAddress}
                  />
                </div>
                <div>
                  <label className={labelClass}>District *</label>
                  <input
                    type="text"
                    value={lead.address.district}
                    onChange={(e) => handleAddressChange(e, "district")}
                    className={inputClass}
                    required={lead.hasAddress}
                    disabled={!lead.hasAddress}
                  />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    value={lead.address.city}
                    onChange={(e) => handleAddressChange(e, "city")}
                    className={inputClass}
                    disabled={!lead.hasAddress}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className={labelClass}>Address Line 1</label>
                  <input
                    type="text"
                    value={lead.address.line1}
                    onChange={(e) => handleAddressChange(e, "line1")}
                    className={inputClass}
                    disabled={!lead.hasAddress}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className={labelClass}>Address Line 2</label>
                  <input
                    type="text"
                    value={lead.address.line2}
                    onChange={(e) => handleAddressChange(e, "line2")}
                    className={inputClass}
                    disabled={!lead.hasAddress}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              type="button"
              onClick={handleReset}
              // Themed reset button
              className="flex items-center px-6 py-3 text-sm font-bold rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRotateCcw className="mr-2" /> Reset
            </motion.button>

            <motion.button
              type="submit"
              // Themed submit button
              className="flex items-center px-8 py-3 text-sm font-bold rounded-lg bg-blue-950 text-white hover:bg-blue-700 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSave className="mr-2" /> Submit Lead
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CustomerLeadDetails;
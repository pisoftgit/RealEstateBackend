import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiSave, FiRotateCcw } from "react-icons/fi";

// Reusing theme classes from IPAddressManager reference
const inputClass =
  "w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm";
const labelClass =
  "block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm";
const sectionClass =
  "p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700";

const AddCustomer = () => {
  const [customer, setCustomer] = useState({
    fullName: "",
    gender: "",
    mobile: "",
    email: "",
    fatherName: "",
    motherName: "",
    panNo: "",
    aadharNo: "",
    dob: "",
    maritalStatus: "",
    permanentAddress: {
      country: "",
      state: "",
      district: "",
      city: "",
      line1: "",
      line2: "",
      pinCode: "",
    },
    correspondenceAddress: {
      sameAsPermanent: false,
      country: "",
      state: "",
      district: "",
      city: "",
      line1: "",
      line2: "",
      pinCode: "",
    },
  });

  const handleChange = (e, section, field) => {
    const { name, value, type, checked } = e.target;

    if (section && field) {
      setCustomer((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === "checkbox" ? checked : value,
        },
      }));
      return;
    }

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSameAsPermanent = (e) => {
    const same = e.target.checked;
    setCustomer((prev) => ({
      ...prev,
      correspondenceAddress: {
        ...prev.correspondenceAddress,
        sameAsPermanent: same,
        // Copy permanent address details if 'same' is true
        ...(same
          ? {
              country: prev.permanentAddress.country,
              state: prev.permanentAddress.state,
              district: prev.permanentAddress.district,
              city: prev.permanentAddress.city,
              line1: prev.permanentAddress.line1,
              line2: prev.permanentAddress.line2,
              pinCode: prev.permanentAddress.pinCode,
            }
          : {}),
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Customer Data:", customer);
    // In a real application, you'd send this data to an API
    alert("Customer Details Submitted Successfully!");
  };

  const handleReset = () => {
    setCustomer({
      fullName: "",
      gender: "",
      mobile: "",
      email: "",
      fatherName: "",
      motherName: "",
      panNo: "",
      aadharNo: "",
      dob: "",
      maritalStatus: "",
      permanentAddress: {
        country: "",
        state: "",
        district: "",
        city: "",
        line1: "",
        line2: "",
        pinCode: "",
      },
      correspondenceAddress: {
        sameAsPermanent: false,
        country: "",
        state: "",
        district: "",
        city: "",
        line1: "",
        line2: "",
        pinCode: "",
      },
    });
  };

  // Helper component for motion and common card layout (optional, but good practice)
  const FormSection = ({ title, children }) => (
    <motion.div
      className={sectionClass}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <h3 className="text-xl font-bold mb-4 text-blue-950 dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2">
        {title}
      </h3>
      {children}
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen p-6 font-sans relative bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto mb-10">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white flex items-center select-none"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FiUserPlus className="mr-3 text-blue-600" /> Add New Customer
        </motion.h1>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- Personal Information --- */}
          <FormSection title="Personal Details">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={customer.fullName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Mobile No *</label>
                <input
                  type="text"
                  name="mobile"
                  value={customer.mobile}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email ID *</label>
                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Gender *</label>
                <select
                  name="gender"
                  value={customer.gender}
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
                <label className={labelClass}>Father’s Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  value={customer.fatherName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Mother’s Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={customer.motherName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Aadhar No</label>
                <input
                  type="text"
                  name="aadharNo"
                  value={customer.aadharNo}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>PAN No</label>
                <input
                  type="text"
                  name="panNo"
                  value={customer.panNo}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={customer.dob}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Marital Status</label>
                <select
                  name="maritalStatus"
                  value={customer.maritalStatus}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">--- Select ---</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </div>
            </div>
          </FormSection>

          {/* --- Permanent Address --- */}
          <FormSection title="Permanent Address">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className={labelClass}>Country *</label>
                <input
                  type="text"
                  value={customer.permanentAddress.country}
                  onChange={(e) => handleChange(e, "permanentAddress", "country")}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>State *</label>
                <input
                  type="text"
                  value={customer.permanentAddress.state}
                  onChange={(e) => handleChange(e, "permanentAddress", "state")}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>District</label>
                <input
                  type="text"
                  value={customer.permanentAddress.district}
                  onChange={(e) =>
                    handleChange(e, "permanentAddress", "district")
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={customer.permanentAddress.city}
                  onChange={(e) => handleChange(e, "permanentAddress", "city")}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Address Line 1 *</label>
                <input
                  type="text"
                  value={customer.permanentAddress.line1}
                  onChange={(e) => handleChange(e, "permanentAddress", "line1")}
                  className={inputClass}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Address Line 2</label>
                <input
                  type="text"
                  value={customer.permanentAddress.line2}
                  onChange={(e) => handleChange(e, "permanentAddress", "line2")}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Pin Code *</label>
                <input
                  type="text"
                  value={customer.permanentAddress.pinCode}
                  onChange={(e) =>
                    handleChange(e, "permanentAddress", "pinCode")
                  }
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </FormSection>

          {/* --- Correspondence Address --- */}
          <FormSection title="Correspondence Address">
            <div className="mb-4">
              <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 font-medium">
                <input
                  type="checkbox"
                  checked={customer.correspondenceAddress.sameAsPermanent}
                  onChange={handleSameAsPermanent}
                  className="mr-2 h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                Same as Permanent Address
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className={labelClass}>Country *</label>
                <input
                  type="text"
                  value={customer.correspondenceAddress.country}
                  onChange={(e) =>
                    handleChange(e, "correspondenceAddress", "country")
                  }
                  disabled={customer.correspondenceAddress.sameAsPermanent}
                  className={`${inputClass} ${
                    customer.correspondenceAddress.sameAsPermanent
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>State *</label>
                <input
                  type="text"
                  value={customer.correspondenceAddress.state}
                  onChange={(e) =>
                    handleChange(e, "correspondenceAddress", "state")
                  }
                  disabled={customer.correspondenceAddress.sameAsPermanent}
                  className={`${inputClass} ${
                    customer.correspondenceAddress.sameAsPermanent
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>District</label>
                <input
                  type="text"
                  value={customer.correspondenceAddress.district}
                  onChange={(e) =>
                    handleChange(e, "correspondenceAddress", "district")
                  }
                  disabled={customer.correspondenceAddress.sameAsPermanent}
                  className={`${inputClass} ${
                    customer.correspondenceAddress.sameAsPermanent
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={customer.correspondenceAddress.city}
                  onChange={(e) =>
                    handleChange(e, "correspondenceAddress", "city")
                  }
                  disabled={customer.correspondenceAddress.sameAsPermanent}
                  className={`${inputClass} ${
                    customer.correspondenceAddress.sameAsPermanent
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Address Line 1 *</label>
                <input
                  type="text"
                  value={customer.correspondenceAddress.line1}
                  onChange={(e) =>
                    handleChange(e, "correspondenceAddress", "line1")
                  }
                  disabled={customer.correspondenceAddress.sameAsPermanent}
                  className={`${inputClass} ${
                    customer.correspondenceAddress.sameAsPermanent
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Address Line 2</label>
                <input
                  type="text"
                  value={customer.correspondenceAddress.line2}
                  onChange={(e) =>
                    handleChange(e, "correspondenceAddress", "line2")
                  }
                  disabled={customer.correspondenceAddress.sameAsPermanent}
                  className={`${inputClass} ${
                    customer.correspondenceAddress.sameAsPermanent
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
              <div>
                <label className={labelClass}>Pin Code *</label>
                <input
                  type="text"
                  value={customer.correspondenceAddress.pinCode}
                  onChange={(e) =>
                    handleChange(e, "correspondenceAddress", "pinCode")
                  }
                  disabled={customer.correspondenceAddress.sameAsPermanent}
                  className={`${inputClass} ${
                    customer.correspondenceAddress.sameAsPermanent
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                  required
                />
              </div>
            </div>
          </FormSection>

          {/* --- Submit / Reset Buttons --- */}
          <div className="flex justify-end space-x-4 pt-4">
            <motion.button
              type="button"
              onClick={handleReset}
              className="flex items-center px-6 py-2 text-sm font-bold rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md"
              whileTap={{ scale: 0.98 }}
            >
              <FiRotateCcw className="mr-2" /> Reset
            </motion.button>
            <motion.button
              type="submit"
              className="flex items-center px-8 py-2 text-sm font-bold rounded-lg bg-blue-950 text-white hover:bg-blue-700 transition-colors shadow-lg"
              whileTap={{ scale: 0.98 }}
            >
              <FiSave className="mr-2" /> Submit
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddCustomer;
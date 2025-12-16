import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiMap, FiSearch, FiMapPin } from "react-icons/fi";

import useStateManagement from "../../../hooks/General/useStateManage";
import useCountry from "../../../hooks/General/useCountry";
import useDistrictManagement from "../../../hooks/General/useDistrictManage";
import { ToastContainer } from "react-toastify";

const DistrictManager = () => {
  const { states, setSelectedCountryId } = useStateManagement();
  const { countries } = useCountry();
  const {
    districts,
    addDistrict,
    updateDistrict,
    deleteDistrict,
    setSelectedStateId,
  } = useDistrictManagement();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const [districtName, setDistrictName] = useState("");
  const [districtCode, setDistrictCode] = useState("");

  const [editingDistrictId, setEditingDistrictId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Load districts when a state is selected
  useEffect(() => {
    setSelectedStateId(selectedState);
  }, [selectedState]);

  const filteredDistricts = districts.filter((d) =>
    d.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountryChange = (e) => {
    const id = e.target.value;
    setSelectedCountry(id);
    setSelectedCountryId(id);
    setSelectedState(null);
  };

  const handleAddDistrict = (e) => {
    e.preventDefault();
    if (!districtName || !districtCode || !selectedState) return;

    addDistrict(districtName, districtCode, selectedState, selectedCountry);

    setDistrictName("");
    setDistrictCode("");
  };

  const openEditModal = (district) => {
    setEditingDistrictId(district.id);
    setDistrictName(district.district);
    setDistrictCode(district.districtCode);
    setSelectedState(district.state.id);
    setIsModalOpen(true);
  };

  const handleUpdateDistrict = (e) => {
    e.preventDefault();
    updateDistrict(editingDistrictId, districtName, districtCode, selectedState, selectedCountry);
    setIsModalOpen(false);
  };

  return (
    <motion.div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 font-dm">
      <h1 className="text-3xl font-bold text-blue-900 dark:text-white mb-10 ml-3">
        District Manager
      </h1>

      <div className="max-w-6xl mx-auto space-y-8">

        {/* Add District Form */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <h2 className="text-xl font-bold mb-4">Add New District</h2>

          <form onSubmit={handleAddDistrict} className="space-y-4">
            
            {/* Country Dropdown */}
            <select
              className="w-full p-3 border rounded-lg"
              value={selectedCountry || ""}
              onChange={handleCountryChange}
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.country}
                </option>
              ))}
            </select>

            {/* State Dropdown */}
            <select
              className="w-full p-3 border rounded-lg"
              value={selectedState || ""}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={!selectedCountry}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.state}
                </option>
              ))}
            </select>

            <input
              className="w-full p-3 border rounded-lg"
              type="text"
              placeholder="District Name"
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
            />

            <input
              className="w-full p-3 border rounded-lg"
              type="text"
              placeholder="District Code"
              value={districtCode}
              onChange={(e) => setDistrictCode(e.target.value)}
            />

            <button className="bg-blue-950 text-white px-4 py-2 rounded-lg">
              <FiPlus className="inline mr-2" /> Add District
            </button>
          </form>
        </div>

        {/* Search Bar */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="flex items-center gap-3">
            <FiSearch size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search districts..."
              className="w-full p-3 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* District List */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <h2 className="text-xl font-bold mb-4">Existing Districts</h2>

          {filteredDistricts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No districts found</p>
          ) : (
            filteredDistricts.map((district) => (
              <div
                key={district.id}
                className="flex justify-between items-center p-4 mb-3 rounded-lg border shadow-md"
              >
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-blue-600" />
                  <span className="font-semibold">{district.district}</span>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => openEditModal(district)}>
                    <FiEdit className="text-blue-600" />
                  </button>
                  <button onClick={() => deleteDistrict(district.id)}>
                    <FiTrash2 className="text-red-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow-xl w-96">

            <h2 className="text-xl font-bold mb-4">Edit District</h2>

            <form onSubmit={handleUpdateDistrict} className="space-y-4">

              <input
                className="w-full p-3 border rounded-lg"
                value={districtName}
                onChange={(e) => setDistrictName(e.target.value)}
              />

              <input
                className="w-full p-3 border rounded-lg"
                value={districtCode}
                onChange={(e) => setDistrictCode(e.target.value)}
              />

              <button className="w-full bg-blue-700 text-white p-3 rounded-lg">
                Update
              </button>
            </form>

            <button
              className="mt-3 w-full text-gray-600 py-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2500} />
    </motion.div>
  );
};

export default DistrictManager;

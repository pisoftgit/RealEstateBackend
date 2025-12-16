import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiMap } from "react-icons/fi";
import useStateManagement from "../../../hooks/General/useStateManage";
import useCountry from "../../../hooks/General/useCountry";

const StateManager = () => {
  const { states, loading, error, addState, updateState, deleteState, setSelectedCountryId } = useStateManagement();
  const { countries, loading: loadingCountries, error: countriesError } = useCountry();

  const [newState, setNewState] = useState("");
  const [newStateCode, setNewStateCode] = useState("");  // state code for new state
  const [selectedCountry, setSelectedCountry] = useState(null);  // Selected country
  const [editingStateId, setEditingStateId] = useState(null);
  const [editingStateName, setEditingStateName] = useState("");
  const [editingStateCode, setEditingStateCode] = useState("");  // Editing state code
  const [editingStateCountry, setEditingStateCountry] = useState(null);  // Editing state country
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Error handling
  const [errorMessage, setErrorMessage] = useState(""); // For error message

  // Set selected country when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      setSelectedCountryId(selectedCountry);
    }
  }, [selectedCountry, setSelectedCountryId]);

  const handleAddState = (e) => {
    e.preventDefault();
    if (!newState.trim() || !newStateCode.trim() || !selectedCountry) return;

    setErrorMessage(""); // Clear any previous errors before making a request
    addState(newState.trim(), newStateCode.trim(), selectedCountry)
      .then(() => {
        setNewState("");
        setNewStateCode("");
        setSelectedCountry(null);
      })
      .catch((err) => setErrorMessage(err?.response?.data?.message || "An error occurred while adding the state."));
  };

  const openEditModal = (state) => {
    setEditingStateId(state.id);
    setEditingStateName(state.state);
    setEditingStateCode(state.stateCode);  // Pre-fill state code
    setEditingStateCountry(state.country.id);  // Pre-select the country
    setIsModalOpen(true);
  };

  const handleUpdateState = (e) => {
    e.preventDefault();
    if (!editingStateName.trim() || !editingStateCode.trim() || !editingStateCountry) return;

    setErrorMessage(""); // Clear any previous errors before making a request
    updateState(editingStateId, editingStateName.trim(), editingStateCode.trim(), editingStateCountry)
      .then(() => {
        setIsModalOpen(false);
        setEditingStateId(null);
        setEditingStateName("");
        setEditingStateCode("");
        setEditingStateCountry(null);
      })
      .catch((err) => setErrorMessage(err?.response?.data?.message || "An error occurred while updating the state."));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      setErrorMessage(""); // Clear previous errors before deleting
      deleteState(id)
        .catch((err) => setErrorMessage(err?.response?.data?.message || "An error occurred while deleting the state."));
    }
  };

  // Group states by country
  const groupedStates = states.reduce((groups, state) => {
    const countryId = state.country.id;
    if (!groups[countryId]) {
      groups[countryId] = [];
    }
    groups[countryId].push(state);
    return groups;
  }, {});

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10">
        State Manager
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <motion.div className="p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New State
          </h2>
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-200 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleAddState} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                State Name
              </label>
              <input
                type="text"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                placeholder="e.g., Maharashtra"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                State Code
              </label>
              <input
                type="text"
                value={newStateCode}
                onChange={(e) => setNewStateCode(e.target.value)}
                placeholder="e.g., MH"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <select
                value={selectedCountry ? selectedCountry : ""}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="" disabled>Select a country</option>
                {loadingCountries ? (
                  <option>Loading countries...</option>
                ) : countriesError ? (
                  <option>Error loading countries</option>
                ) : (
                  countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.country}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setNewState("");
                  setNewStateCode("");
                  setSelectedCountry(null);
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
              >
                Reset
              </button>
              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> Add State
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* List */}
        <motion.div className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing States ({states.length})
          </h2>

          <AnimatePresence>
            {Object.keys(groupedStates).length > 0 ? (
              Object.entries(groupedStates).map(([countryId, countryStates]) => {
                const country = countries.find(c => c.id === parseInt(countryId));
                return (
                  <motion.div key={countryId} className="space-y-5">
                    <h3 className="text-xl font-bold text-blue-950 dark:text-white mb-3">
                      {country ? country.country : "Unknown Country"}
                    </h3>
                    {countryStates.map((s) => (
                      <motion.div
                        key={s.id}
                        className="flex justify-between items-center p-4 rounded-xl shadow-md border-2 border-dashed border-blue-600 bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center text-lg font-semibold text-blue-950 dark:text-blue-300">
                          <FiMap className="mr-2 text-blue-600" /> {s.state}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                );
              })
            ) : (
              <p className="text-center py-10 text-gray-500">
                No states found. Add one using the form on the left.
              </p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Edit State Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        >
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-96">
            <h2 className="text-2xl font-bold text-blue-950 dark:text-white mb-4">Edit State</h2>
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-200 text-red-700 rounded-lg">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleUpdateState}>
              <input
                type="text"
                value={editingStateName}
                onChange={(e) => setEditingStateName(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="State Name"
                required
              />
              <input
                type="text"
                value={editingStateCode}
                onChange={(e) => setEditingStateCode(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="State Code"
                required
              />
              <select
                value={editingStateCountry}
                onChange={(e) => setEditingStateCountry(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="" disabled>Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.country}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-blue-950 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Update State
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-3 text-gray-500 dark:text-gray-300 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StateManager;


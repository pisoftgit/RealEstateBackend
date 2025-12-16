import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit, FiX } from "react-icons/fi";
import axios from "axios";

import useHolidayActions from "../../../../hooks/HR/Holiday/useHolidayActions";
import { backendUrl } from "../../../../ProtectedRoutes/api";
const secretKey = localStorage.getItem("authToken");

const PRIMARY_COLOR = 'blue-950';
const INPUT_BORDER = 'gray-300';

const HolidaySetup = () => {
  const [holidayTypes, setHolidayTypes] = useState([]);
  const [durations, setDurations] = useState([]);

  const [holidayData, setHolidayData] = useState({
    holidayTypeId: "",
    holidayName: "",
    durationId: "",
    holidayDate: "",
    day: "",
    month: "",
  });

  const [editHoliday, setEditHoliday] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { holidays, addHoliday, updateHoliday, deleteHoliday } =
    useHolidayActions();

  // Utility to handle Edit Modal date change
  const handleEditDateChange = (dateStr) => {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("en-US", { month: "long" }).toUpperCase();

    setEditHoliday({
      ...editHoliday,
      holidayDate: dateStr,
      day,
      month,
    });
  };

  // ===========================================
  // Fetch Dropdown: Holiday Types
  // ===========================================
  const fetchHolidayTypes = async () => {
    try {
      const res = await axios.get(`${backendUrl}/holiday-type`, {
        headers: { secret_key:secretKey },
      });
      // Added defensive check for data structure
      setHolidayTypes(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to load Holiday Types:", err);
    }
  };

  // ===========================================
  // Fetch Durations (Status)
  // ===========================================
  const fetchDurations = async () => {
    try {
      const res = await axios.get(`${backendUrl}/duration/`, {
        headers: { secret_key: secretKey }
      });
      // Added defensive check for data structure
      setDurations(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to load durations:", err);
    }
  };

  useEffect(() => {
    fetchHolidayTypes();
    fetchDurations();
  }, []);

  const handleDateChange = (dateStr) => {
    const dateObj = new Date(dateStr);

    let day = "";
    let month = "";
    if (!isNaN(dateObj)) {
      day = dateObj.getDate().toString();
      month = dateObj.toLocaleString("en-US", { month: "long" }).toUpperCase();
    }


    setHolidayData({
      ...holidayData,
      holidayDate: dateStr,
      day,
      month,
    });
  };

  // ===========================================
  // ADD Holiday
  // ===========================================
  const handleAddHoliday = async (e) => {
    e.preventDefault();

    try {
      await addHoliday(holidayData);
      setHolidayData({
        holidayTypeId: "",
        holidayName: "",
        durationId: "",
        holidayDate: "",
        day: "",
        month: "",
      });
    } catch (err) {
      console.error("Add Error:", err);
    }
  };

  // ===========================================
  // OPEN EDIT MODAL
  // ===========================================
  const openEditModal = (holiday) => {
    const dateObj = new Date(holiday.holidayDate);
    const day = holiday.day || (isNaN(dateObj) ? "" : dateObj.getDate().toString());
    const month = holiday.month || (isNaN(dateObj) ? "" : dateObj.toLocaleString("en-US", { month: "long" }).toUpperCase());

    setEditHoliday({
      ...holiday,
      day,
      month,
    });
    setIsEditModalOpen(true);
  };

  // ===========================================
  // UPDATE Holiday
  // ===========================================
  const handleUpdateHoliday = async (e) => {
    e.preventDefault();
    if (!editHoliday || !editHoliday.id) return;

    const updated = {
      holidayName: editHoliday.holidayName,
      holidayTypeId: editHoliday.holidayTypeId,
      holidayDate: editHoliday.holidayDate,
      durationId: editHoliday.durationId,
      day: editHoliday.day,
      month: editHoliday.month,
    };

    try {
      await updateHoliday(editHoliday.id, updated);
      setIsEditModalOpen(false);
      setEditHoliday(null);
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // ===========================================
  // DELETE HOLIDAY MODAL
  // ===========================================
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteHoliday = async () => {
    try {
      await deleteHoliday(deleteId);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // Helper to get the name from ID
  const getHolidayTypeName = (id) => {
    const type = holidayTypes.find(t => t.id === id);
    return type ? type.holidayName : '-';
  };

  const getDurationName = (id) => {
    const duration = durations.find(d => d.id === id);
    return duration ? d.status : '-';
  };

  // ===========================================
  // UI Start
  // ===========================================
  return (
    <motion.div
      // Apply the requested font-dm globally to this component
      className={`min-h-screen font-dm p-6 sm:p-10 bg-gray-50 dark:bg-gray-950 font-dm`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="mb-10 border-b pb-4 border-gray-200 dark:border-gray-800">
        <h1 className={`text-4xl font-extrabold text-${PRIMARY_COLOR} dark:text-blue-400`}>
          Holiday Setup
        </h1> </header>

      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
          className={`p-6 md:p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 border border-${INPUT_BORDER} dark:border-gray-700`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Add New Holiday</h2>

          <form onSubmit={handleAddHoliday} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Holiday Type */}
            <div className="col-span-1">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Holiday Type <span className="text-red-500">*</span></label>
              <select
                value={holidayData.holidayTypeId}
                onChange={(e) =>
                  setHolidayData({ ...holidayData, holidayTypeId: e.target.value })
                }
                required
                className={`w-full p-3 border border-${INPUT_BORDER} rounded-lg focus:ring-2 focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              >
                <option value="">Select Type</option>
                {holidayTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.holidayName}
                  </option>
                ))}
              </select>
            </div>

            {/* Holiday Name */}
            <div className="col-span-1">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Holiday Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={holidayData.holidayName}
                onChange={(e) =>
                  setHolidayData({ ...holidayData, holidayName: e.target.value })
                }
                className={`w-full p-3 border border-${INPUT_BORDER} rounded-lg focus:ring-2 focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                required
                placeholder="e.g., Christmas Day"
              />
            </div>

            {/* Duration (Status) */}
            <div className="col-span-1">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Duration (Status) <span className="text-red-500">*</span></label>
              <select
                value={holidayData.durationId}
                onChange={(e) =>
                  setHolidayData({ ...holidayData, durationId: e.target.value })
                }
                required
                className={`w-full p-3 border border-${INPUT_BORDER} rounded-lg focus:ring-2 focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              >
                <option value="">Select Duration</option>
                {durations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.status}
                  </option>
                ))}
              </select>
            </div>

            {/* Holiday Date */}
            <div className="col-span-1">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Holiday Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={holidayData.holidayDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className={`w-full p-3 border border-${INPUT_BORDER} rounded-lg focus:ring-2 focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                required
              />
            </div>

            {/* Auto day + month display and Add Button */}
            <div className="md:col-span-2 lg:col-span-3 flex items-center gap-6">
              <p className="text-gray-700 dark:text-gray-400">
                <span className="font-semibold">Day:</span> <b className="text-gray-900 dark:text-white">{holidayData.day || "-"}</b>
                <span className="mx-4 text-gray-400">|</span>
                <span className="font-semibold">Month:</span> <b className="text-gray-900 dark:text-white">{holidayData.month || "-"}</b>
              </p>
            </div>

            <div className="md:col-span-2 lg:col-span-1 flex justify-end items-center">
              <button
                type="submit"
                className={`w-full md:w-auto px-6 py-3 bg-${PRIMARY_COLOR} hover:bg-blue-800 text-white font-semibold rounded-xl transition duration-200 shadow-md flex items-center justify-center`}
              >
                <FiPlus className="inline-block mr-2" /> Add Holiday
              </button>
            </div>
          </form>
        </motion.div>

        {/* ===================== TABLE ===================== */}
        <motion.div
          className={`p-6 md:p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 border border-${INPUT_BORDER} dark:border-gray-700 overflow-x-auto`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Existing Holidays
            <span className={`ml-2 text-xl text-${PRIMARY_COLOR} dark:text-blue-400`}>
              ({holidays.length})
            </span>
          </h2>

          {holidays.length === 0 ? (
            <p className="text-center py-10 text-lg text-gray-500 dark:text-gray-400">
              <span className="block mb-2">😔</span>
              No holidays found. Please add a new one above.
            </p>
          ) : (
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className={`bg-${PRIMARY_COLOR} text-white uppercase tracking-wider`}>
                  <th className="p-3 text-left rounded-tl-xl">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Day</th>
                  <th className="p-3 text-left">Month</th>
                  <th className="p-3 text-center rounded-tr-xl">Actions</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {holidays.map((h, i) => (
                    <motion.tr
                      key={h.id}
                      className="border-b border-gray-200 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-150"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="p-3 font-semibold text-gray-600 dark:text-gray-300">{i + 1}</td>
                      <td className="p-3 font-medium text-gray-800 dark:text-white">{h.holidayName}</td>

                      {/* Use helper functions to display the friendly name if available */}
                      <td className="p-3 text-gray-700 dark:text-gray-300">{getHolidayTypeName(h.holidayTypeId) || "-"}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{h.duration|| "-"}</td>

                      <td className="p-3  text-gray-700 dark:text-gray-300 font-mono">{h.holidayDate || "-"}</td>
                      <td className="p-3  text-gray-700 dark:text-gray-300">{h.day ?? "-"}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{h.month || "-"}</td>

                      <td className="p-3 text-gray-700 dark:text-gray-300 text-center space-x-3">
                        <button
                          className="text-yellow-600 hover:text-yellow-500 transition duration-150 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={() => openEditModal(h)}
                          aria-label="Edit Holiday"
                        >
                          <FiEdit size={16} />
                        </button>

                        <button
                          className="text-red-600 hover:text-red-500 transition duration-150 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={() => openDeleteModal(h.id)}
                          aria-label="Delete Holiday"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

          )}
        </motion.div>
      </div>

      {/* ===================== EDIT MODAL ===================== */}
      <AnimatePresence>
        {isEditModalOpen && editHoliday && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-white dark:bg-gray-800 p-8 w-full max-w-md rounded-2xl shadow-2xl relative`}
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-full transition"
                aria-label="Close Edit Modal"
              >
                <FiX size={20} />
              </button>

              <h2 className={`text-2xl font-bold mb-6 text-${PRIMARY_COLOR} dark:text-blue-400`}>
                Edit Holiday
              </h2>

              <form onSubmit={handleUpdateHoliday} className="space-y-5">

                {/* Holiday Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Holiday Name</label>
                  <input
                    type="text"
                    value={editHoliday.holidayName}
                    onChange={(e) =>
                      setEditHoliday({ ...editHoliday, holidayName: e.target.value })
                    }
                    className={`w-full p-3 border border-${INPUT_BORDER} rounded-lg focus:ring-2 focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                    required
                  />
                </div>

                {/* Holiday Type (Dropdown) */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Holiday Type</label>
                  <select
                    value={editHoliday.holidayTypeId}
                    onChange={(e) =>
                      setEditHoliday({ ...editHoliday, holidayTypeId: e.target.value })
                    }
                    className={`w-full p-3 border border-${INPUT_BORDER} rounded-lg focus:ring-2 focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                    required
                  >
                    <option value="">Select Type</option>
                    {holidayTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.holidayName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration (Status) */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Duration (Status)</label>
                  <select
                    value={editHoliday.durationId}
                    onChange={(e) =>
                      setEditHoliday({ ...editHoliday, durationId: e.target.value })
                    }
                    className={`w-full p-3 border border-${INPUT_BORDER} rounded-lg focus:ring-2 focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                    required
                  >
                    <option value="">Select Duration</option>
                    {durations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Holiday Date (and Auto Calculate Day/Month) */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Holiday Date</label>
                  <input
                    type="date"
                    value={editHoliday.holidayDate}
                    onChange={(e) => handleEditDateChange(e.target.value)}
                    className={`w-full p-3 border border-${INPUT_BORDER} rounded-lg focus:ring-2 focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span className="font-semibold">Calculated:</span> {editHoliday.day || "-"} / {editHoliday.month || "-"}
                  </p>
                </div>


                {/* Save Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition duration-150 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2.5 bg-${PRIMARY_COLOR} hover:bg-blue-800 text-white font-medium rounded-xl transition duration-150 shadow-md`}
                  >
                    <FiEdit className="inline-block mr-1" /> Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== DELETE MODAL ===================== */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-sm shadow-2xl"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-red-600">
                <FiTrash2 className="inline-block mr-2" /> Confirm Deletion
              </h2>

              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you absolutely sure you want to delete this holiday entry? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition duration-150 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition duration-150 shadow-md"
                  onClick={handleDeleteHoliday}
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HolidaySetup;
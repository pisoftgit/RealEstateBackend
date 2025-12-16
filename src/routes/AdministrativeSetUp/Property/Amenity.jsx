import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit } from "react-icons/fi";

import useAmenities from "../../../hooks/propertyConfig/useAmenities";

const ConfigureAmenity = () => {
  const {
    amenities,
    loading,
    addAmenity,
    updateAmenity,
    deleteAmenity,
  } = useAmenities();

  const [amenity, setAmenity] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Reset form
  const resetForm = () => {
    setAmenity("");
    setEditingId(null);
    setIsEditing(false);
  };

  // Start editing
  const startEditing = (item) => {
    setAmenity(item.amenityName);
    setEditingId(item.id);
    setIsEditing(true);
  };

  // ADD AMENITY
  const handleAddAmenity = async (e) => {
    e.preventDefault();
    if (!amenity.trim()) return;

    try {
      await addAmenity({ amenityName: amenity.trim() });
      resetForm();
    } catch (err) {
      console.error("Add failed:", err);
      alert("Failed to add amenity");
    }
  };

  // UPDATE AMENITY
  const handleUpdateAmenity = async (e) => {
    e.preventDefault();
    if (!amenity.trim()) return;

    try {
      await updateAmenity({ id: editingId, amenityName: amenity.trim() });
      resetForm();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update amenity");
    }
  };

  // DELETE AMENITY
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this amenity?")) return;

    try {
      await deleteAmenity(id);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete amenity");
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl ml-4 font-dm font-bold text-blue-950 dark:text-white mb-10">
        Amenity Configuration
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* FORM */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-dm font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            {isEditing ? "Update Amenity" : "Add New Amenity"}
          </h2>

          <form
            onSubmit={isEditing ? handleUpdateAmenity : handleAddAmenity}
            className="space-y-5"
          >
            <div>
              <label className="block font-dm text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                Amenity Name <span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                value={amenity}
                onChange={(e) => setAmenity(e.target.value)}
                placeholder="e.g., Covered Parking, Lift"
                className="w-full p-3 border font-dm border-gray-300 dark:border-gray-700 rounded-lg 
                bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-dm font-medium rounded-lg text-gray-600 bg-gray-200 
                hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 transition"
              >
                {isEditing ? "Cancel" : "Reset"}
              </button>

              <motion.button
                type="submit"
                className={`flex items-center px-4 py-2 text-sm font-dm font-medium rounded-lg text-white  
                ${isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-950 hover:bg-blue-700"}`}
                whileTap={{ scale: 0.98 }}
              >
                {isEditing ? (
                  <>
                    <FiEdit className="mr-1" /> Update Amenity
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-1" /> Add Amenity
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* AMENITIES TABLE */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-dm font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Amenities ({amenities.length})
          </h2>

          {loading ? (
            <p className="text-center py-10 font-dm text-gray-500 dark:text-gray-400">
              Loading amenities...
            </p>
          ) : amenities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full font-dm border-collapse min-w-[500px] text-gray-900 dark:text-white">
                <thead>
                  <tr className="bg-blue-950 font-dm text-white dark:bg-gray-700">
                    <th className="p-3 text-left font-dm text-sm">Sr No</th>
                    <th className="p-3 text-left font-dm text-sm">Amenity Name</th>
                    <th className="p-3 text-center font-dm text-sm">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence initial={false}>
                    {amenities.map((a, idx) => (
                      <motion.tr
                        key={a.id}
                        className={`border-b ${
                          idx % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-900"
                        }`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td className="p-3 text-sm font-dm ">{idx + 1}</td>

                        <td className="p-3 text-sm font-dm ">{a.amenityName}</td>

                        <td className="p-3 text-center font-dm flex justify-center gap-3">
                          {/* EDIT */}
                          <motion.button
                            onClick={() => startEditing(a)}
                            className="p-1 text-blue-600 font-dm hover:bg-blue-100 rounded-full"
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiEdit size={18} />
                          </motion.button>

                          {/* DELETE */}
                          <motion.button
                            onClick={() => handleDelete(a.id)}
                            className="p-1 text-red-600 font-dm hover:bg-red-100 rounded-full"
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiTrash2 size={18} />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-10 font-dm text-gray-500 dark:text-gray-400">
              No amenities found.
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConfigureAmenity;

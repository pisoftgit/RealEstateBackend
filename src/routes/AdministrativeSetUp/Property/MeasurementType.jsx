import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import useMeasurementUnits from "../../../hooks/propertyConfig/useMeasurementUnits";

const ConfigureMeasurementType = () => {
  const { units, loading, addUnit, updateUnit, deleteUnit } = useMeasurementUnits();

  const [unit, setUnit] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const resetForm = () => setUnit("");

  // Add New Unit
  const handleAddUnit = async (e) => {
    e.preventDefault();
    const newUnit = unit.trim();
    if (!newUnit) return;

    // Prevent duplicates
    const exists = units.some(
      (u) => u.unitName.trim().toLowerCase() === newUnit.toLowerCase()
    );
    if (exists) {
      alert(`'${newUnit}' already exists.`);
      return;
    }

    try {
      await addUnit({ unitName: newUnit });
      resetForm();
    } catch {
      alert("Failed to add unit.");
    }
  };

  // Start Inline Edit
  const startEditing = (u) => {
    setEditingId(u.id);
    setEditingValue(u.unitName);
  };

  // Cancel Inline Edit
  const cancelEditing = () => {
    setEditingId(null);
    setEditingValue("");
  };

  // Save Inline Update
  const saveUpdate = async () => {
    const trimmed = editingValue.trim();
    if (!trimmed) return;

    const exists = units.some(
      (u) =>
        u.unitName.trim().toLowerCase() === trimmed.toLowerCase() &&
        u.id !== editingId
    );
    if (exists) {
      alert(`'${trimmed}' already exists.`);
      return;
    }

    try {
      await updateUnit({ id: editingId, unitName: trimmed });
      cancelEditing();
    } catch {
      alert("Failed to update unit.");
    }
  };

  // Delete Unit
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this measurement unit?")) return;

    try {
      await deleteUnit(id);
    } catch {
      alert("Failed to delete unit.");
    }
  };

  return (
    <motion.div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 font-dm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold mb-10 text-blue-950 dark:text-white ml-4">
        Measurement Unit Configuration
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* ADD FORM */}
        <motion.div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Measurement Unit
          </h2>

          <form onSubmit={handleAddUnit} className="space-y-5">
            <div>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., Sq. meter, Hectare, Bigha"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-700"
            >
              Add Unit
            </motion.button>
          </form>
        </motion.div>

        {/* TABLE */}
        <motion.div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Measurement Units ({units.length})
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500">Loading...</p>
          ) : (
            <table className="w-full min-w-[500px] rounded-lg">
              <thead>
                <tr className="bg-blue-950 text-white dark:bg-gray-700">
                  <th className="p-3 text-left text-sm font-semibold">S/N</th>
                  <th className="p-3 text-left text-sm font-semibold">Unit Name</th>
                  <th className="p-3 text-center text-sm font-semibold w-32">Actions</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {units.map((u, idx) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`${idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"} border-b`}
                    >
                      {/* S/N */}
                      <td className="p-3 text-sm">{idx + 1}</td>

                      {/* INLINE EDIT CELL */}
                      <td className="p-3 text-sm text-blue-900 dark:text-blue-300">
                        {editingId === u.id ? (
                          <input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          u.unitName
                        )}
                      </td>

                      {/* ACTION BUTTONS */}
                      <td className="p-3 text-center flex items-center justify-center gap-3">
                        {editingId === u.id ? (
                          <>
                            {/* Save */}
                            <motion.button
                              onClick={saveUpdate}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-green-600 hover:bg-green-100 rounded-full"
                              title="Save"
                            >
                              <FiCheck size={18} />
                            </motion.button>

                            {/* Cancel */}
                            <motion.button
                              onClick={cancelEditing}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
                              title="Cancel"
                            >
                              <FiX size={18} />
                            </motion.button>
                          </>
                        ) : (
                          <>
                            {/* Edit */}
                            <motion.button
                              onClick={() => startEditing(u)}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                              title="Edit"
                            >
                              <FiEdit2 size={16} />
                            </motion.button>

                            {/* Delete */}
                            <motion.button
                              onClick={() => handleDelete(u.id)}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                              title="Delete"
                            >
                              <FiTrash2 size={16} />
                            </motion.button>
                          </>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConfigureMeasurementType;

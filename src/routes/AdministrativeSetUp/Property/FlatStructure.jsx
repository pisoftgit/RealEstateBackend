import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit } from "react-icons/fi";
import useFlatHouseStructures from "../../../hooks/propertyConfig/useFlatHouseStructure";
import useFlatHouseStructureTypes from "../../../hooks/propertyConfig/useFlatHouseStructureType";

const ConfigureFlatStructure = () => {
  const {
    structures,
    loading,
    addStructure,
    updateStructure,
    deleteStructure,
  } = useFlatHouseStructures();

  const { types: structureTypes, loading: typesLoading } = useFlatHouseStructureTypes();

  const [structureName, setStructureName] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [editId, setEditId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const resetForm = () => {
    setStructureName("");
    setSelectedTypeId("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!structureName || !selectedTypeId) return;

    const selectedType = structureTypes.find((t) => t.id.toString() === selectedTypeId);
    const combinedStructure = `${structureName}${selectedType?.structureType || ""}`;

    setFormLoading(true);
    try {
      if (editId) {
        await updateStructure({
          id: editId,
          structureName,
          flatHouseStructureTypeId: selectedTypeId,
          structure: combinedStructure,
        });
        alert("Structure updated successfully!");
      } else {
        await addStructure({
          structureName,
          flatHouseStructureTypeId: selectedTypeId,
          structure: combinedStructure,
        });
        alert("Structure added successfully!");
      }
      resetForm();
    } catch (err) {
      alert("Operation failed. Check console.");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (item) => {
    setStructureName(item.structureName);
    setSelectedTypeId(item.flatHouseStructureType.id?.toString() || "");
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this structure?")) return;
    try {
      await deleteStructure(id);
    } catch (err) {
      alert("Failed to delete.");
      console.error(err);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10 ml-4">
        Flat/House Structure Configuration
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* FORM BOX */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-blue-950 dark:text-white">
            {editId ? "Update Structure" : "Add New Structure"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Property Structure Type Select */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Property Structure Type <span className="text-red-600">*</span>
              </label>

              <select
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700
                  border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                required
                disabled={typesLoading || formLoading}
              >
                <option value="" disabled>
                  Select a type
                </option>
                {typesLoading ? (
                  <option>Loading...</option>
                ) : (
                  structureTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.structureType}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Property Structure Name Input */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Structure Name <span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                value={structureName}
                onChange={(e) => setStructureName(e.target.value)}
                placeholder="e.g., 1, 2, Shared"
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700
                  border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                required
                disabled={formLoading}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                disabled={formLoading}
              >
                Cancel
              </button>

              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 rounded-lg text-white bg-blue-950 hover:bg-blue-700"
                whileTap={{ scale: 0.98 }}
                disabled={formLoading}
              >
                {formLoading
                  ? "Processing..."
                  : editId
                  ? (
                    <>
                      <FiEdit className="mr-1" /> Update
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-1" /> Add Structure
                    </>
                  )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* TABLE SECTION */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-blue-950 dark:text-white">
            Existing Flat/House Structures ({structures.length})
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : structures.length === 0 ? (
            <p className="text-center text-gray-500">No structures found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-gray-900 dark:text-white">
                <thead>
                  <tr className="bg-blue-950 text-white dark:bg-gray-700">
                    <th className="p-3">Sr No</th>
                    <th className="p-3">Structure Name</th>
                    <th className="p-3">Structure Type</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {structures.map((s, idx) => (
                    <tr
                      key={s.id}
                      className={`border-b ${
                        idx % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3 font-medium">{s.structureName}</td>
                      <td className="p-3 font-medium">{s.flatHouseStructureType.structureType}</td>
                      <td className="p-3 text-center space-x-3">
                        <button
                          onClick={() => handleEdit(s)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                          title="Edit Structure"
                          disabled={formLoading}
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                          title="Delete"
                          disabled={formLoading}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConfigureFlatStructure;

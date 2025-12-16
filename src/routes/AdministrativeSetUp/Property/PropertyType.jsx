import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit3, FiCheck, FiX } from "react-icons/fi";
import useRealEstatePropertyTypes from "../../../hooks/propertyConfig/useRealEstatePropertyTypes ";

const PropertyType = () => {
  const [propertyType, setPropertyType] = useState({ name: "", code: "" });

  const {
    propertyTypes,
    loading,
    addPropertyType,
    updatePropertyType,
    deletePropertyType,
  } = useRealEstatePropertyTypes();

  // EDIT STATES
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", code: "" });

  const resetForm = () => setPropertyType({ name: "", code: "" });

  // ADD PROPERTY TYPE
  const handleAddPropertyType = async (e) => {
    e.preventDefault();

    if (!propertyType.name.trim() || !propertyType.code.trim()) return;

    const exists = propertyTypes.some(
      (p) => p.code?.toString() === propertyType.code.trim()
    );
    if (exists) {
      alert(`Code '${propertyType.code.trim()}' already exists.`);
      return;
    }

    try {
      await addPropertyType({
        name: propertyType.name.trim(),
        code: propertyType.code.trim(),
        isResidential: propertyType.code.trim() === "1",
        isCommercial: propertyType.code.trim() === "2",
      });

      resetForm();
    } catch (err) {
      console.error("Failed to add property type", err);
    }
  };

  // START EDITING
  const startEdit = (item) => {
    setEditId(item.id);
    setEditData({
      name: item.name,
      code: item.code.toString(),
    });
  };

  // CANCEL EDITING
  const cancelEdit = () => {
    setEditId(null);
    setEditData({ name: "", code: "" });
  };

  // SAVE UPDATE
  const saveUpdate = async (id) => {
    try {
      await updatePropertyType({
        id,
        name: editData.name,
        code: editData.code,
        isResidential: editData.code === "1",
        isCommercial: editData.code === "2",
      });

      cancelEdit();
    } catch (err) {
      console.error("Failed to update type", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await deletePropertyType(id);
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10 ml-4">
        Property Type Configuration
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* ADD FORM */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Property Type
          </h2>

          <form onSubmit={handleAddPropertyType} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* NAME */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={propertyType.name}
                  onChange={(e) =>
                    setPropertyType({ ...propertyType, name: e.target.value })
                  }
                  className="w-full p-3 rounded bg-gray-50 border dark:bg-gray-700"
                />
              </div>

              {/* CODE */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  value={propertyType.code}
                  onChange={(e) =>
                    setPropertyType({ ...propertyType, code: e.target.value })
                  }
                  className="w-full p-3 rounded bg-gray-50 border dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Reset
              </button>

              <motion.button
                type="submit"
                className="px-4 py-2 bg-blue-950 text-white rounded"
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus className="inline mr-1" /> Add Type
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* TABLE */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Property Types ({propertyTypes.length})
          </h2>

          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : (
            <table className="w-full min-w-[500px] text-gray-900 dark:text-white">
              <thead>
                <tr className="bg-blue-950 text-white">
                  <th className="p-3">Sr</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Code</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {propertyTypes.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-3">{i + 1}</td>

                    {/* NAME */}
                    <td className="p-3">
                      {editId === p.id ? (
                        <input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="w-full p-2 rounded bg-blue-100 border dark:bg-gray-700"
                        />
                      ) : (
                        p.name
                      )}
                    </td>

                    {/* CODE */}
                    <td className="p-3">
                      {editId === p.id ? (
                        <input
                          type="number"
                          value={editData.code}
                          onChange={(e) =>
                            setEditData({ ...editData, code: e.target.value })
                          }
                          className="w-full p-2 rounded bg-blue-100 border dark:bg-gray-700"
                        />
                      ) : (
                        p.code
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3 text-center flex justify-center gap-3">
                      {editId === p.id ? (
                        <>
                          <motion.button
                            onClick={() => saveUpdate(p.id)}
                            className="text-green-600"
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiCheck size={18} />
                          </motion.button>

                          <motion.button
                            onClick={cancelEdit}
                            className="text-gray-500"
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiX size={18} />
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <motion.button
                            onClick={() => startEdit(p)}
                            className="text-blue-600"
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiEdit3 size={18} />
                          </motion.button>

                          <motion.button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600"
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiTrash2 size={18} />
                          </motion.button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PropertyType;

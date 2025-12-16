import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit } from "react-icons/fi";
import useSubPropertyTypes from "../../../hooks/propertyConfig/useSubPropertyTypes";
import useRealEstatePropertyTypes from "../../../hooks/propertyConfig/useRealEstatePropertyTypes ";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const ConfigureSubPropertyType = () => {
  const {
    subPropertyTypes,
    loading,
    addSubPropertyType,
    updateSubPropertyType,
    deleteSubPropertyType,
  } = useSubPropertyTypes();

  const { propertyTypes, loading: propertyTypesLoading } = useRealEstatePropertyTypes();

  const [natureCodes, setNatureCodes] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedNatureCode, setSelectedNatureCode] = useState("");
  const [subPropertyName, setSubPropertyName] = useState("");
  const [editId, setEditId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch Nature Codes
  const fetchNatureCodes = async () => {
    try {
      const secretKey = localStorage.getItem("authToken");
      const res = await axios.get(
        `${backendUrl}/real-estate-properties/getAllPropertyStructureNature`,
        { headers: { secret_key: secretKey } }
      );

      setNatureCodes(res.data ? [res.data] : []);
    } catch (err) {
      console.error("Error fetching nature codes:", err);
      setNatureCodes([]);
    }
  };

  useEffect(() => {
    fetchNatureCodes();
  }, []);

  const resetForm = () => {
    setSubPropertyName("");
    setSelectedPropertyType("");
    setSelectedNatureCode("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subPropertyName || !selectedPropertyType || !selectedNatureCode) return;

    setFormLoading(true);
    try {
      if (editId) {
        await updateSubPropertyType({
          id: editId,
          name: subPropertyName,
          realEstatePropertyTypeId: selectedPropertyType,
          natureCode: selectedNatureCode,
        });
        alert("Sub Property Type updated successfully!");
      } else {
        await addSubPropertyType({
          name: subPropertyName,
          realEstatePropertyTypeId: selectedPropertyType,
          natureCode: selectedNatureCode,
        });
        alert("Sub Property Type added successfully!");
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
    setSubPropertyName(item.name);
    setSelectedPropertyType(item.realEstatePropertyType.id.toString());
    setSelectedNatureCode(item.natureCode.toString());
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub property type?")) return;
    try {
      await deleteSubPropertyType(id);
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
        Sub Property Type Configuration
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* FORM BOX */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-blue-950 dark:text-white">
            {editId ? "Update Sub Property Type" : "Add New Sub Property Type"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Property Type */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Property Type <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                required
                disabled={propertyTypesLoading || formLoading}
              >
                <option value="" disabled>Select a property type</option>
                {propertyTypes.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Nature Code */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Nature Code <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedNatureCode}
                onChange={(e) => setSelectedNatureCode(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                required
                disabled={formLoading || natureCodes.length === 0}
              >
                <option value="" disabled>Select a nature code</option>
                {natureCodes.map((n) => (
                  <option key={n.code} value={n.code}>{n.name}</option>
                ))}
              </select>
            </div>

            {/* Sub Property Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Sub Property Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={subPropertyName}
                onChange={(e) => setSubPropertyName(e.target.value)}
                placeholder="e.g., Booth, Showroom"
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
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
                      <FiPlus className="mr-1" /> Add
                    </>
                  )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* TABLE SECTION */}
        <motion.div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-blue-950 dark:text-white">
            Existing Sub Property Types ({subPropertyTypes.length})
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : subPropertyTypes.length === 0 ? (
            <p className="text-center text-gray-500">No sub property types found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-gray-900 dark:text-white">
                <thead>
                  <tr className="bg-blue-950 text-white dark:bg-gray-700">
                    <th className="p-3">Sr No</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Property Type</th>
                    <th className="p-3">Nature Code</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subPropertyTypes.map((s, idx) => (
                    <tr
                      key={s.id}
                      className={`border-b ${
                        idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3 font-medium">{s.name}</td>
                      <td className="p-3 font-medium">{s.realEstatePropertyType?.name}</td>
                      <td className="p-3 font-medium">{natureCodes.find(n => n.code === s.natureCode)?.name || s.natureCode}</td>
                      <td className="p-3 text-center space-x-3">
                        <button
                          onClick={() => handleEdit(s)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                          title="Edit"
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

export default ConfigureSubPropertyType;

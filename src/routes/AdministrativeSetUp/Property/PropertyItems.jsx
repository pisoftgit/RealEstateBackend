import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus } from "react-icons/fi";
import usePropertyItems from "../../../hooks/propertyConfig/usePropertyItems";
import useRealEstatePropertyTypes from "../../../hooks/propertyConfig/useRealEstatePropertyTypes "; 

const ConfigurePropertyItems = () => {
  const {
    propertyItems,
    loading,
    addPropertyItem,
    deletePropertyItem,
  } = usePropertyItems();

  const { propertyTypes } = useRealEstatePropertyTypes();

  const [item, setItem] = useState({
    name: "",
    code: "",
    realEstatePropertyTypeId: "",
  });

  // Code presets that also determine flag values
  const unitCodes = [
    { name: "Flat", code: 1, flags: { isFlat: true } },
    { name: "House/Villa", code: 2, flags: { isHouseVilla: true } },
    { name: "Plot (Residential / Commercial)", code: 3, flags: { isPlot: true } },
    { name: "Commercial Unit", code: 4, flags: { isCommercialUnit: true } },
  ];

  const resetForm = () =>
    setItem({
      name: "",
      code: "",
      realEstatePropertyTypeId: "",
    });

  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!item.name.trim() || !item.code || !item.realEstatePropertyTypeId)
      return;

    // Prevent duplicate name per property type
    const exists = propertyItems.some(
      (i) =>
        i.name.trim().toLowerCase() === item.name.trim().toLowerCase() &&
        i.realEstatePropertyType?.id === item.realEstatePropertyTypeId
    );

    if (exists) {
      alert(
        `The property item '${item.name.trim()}' already exists for this property type.`
      );
      return;
    }

    // Determine flags based on selected code
    const selectedCodeData = unitCodes.find((u) => u.code === Number(item.code));
    const flagValues = selectedCodeData?.flags || {};

    // Determine Residential / Commercial flag from property type
    const selectedType = propertyTypes.find(
      (pt) => pt.id === item.realEstatePropertyTypeId
    );

    try {
      await addPropertyItem({
        name: item.name.trim(),
        code: item.code,
        realEstatePropertyTypeId: item.realEstatePropertyTypeId,

        // Flags:
        isResidential: Boolean(selectedType?.isResidential),
        isCommercial: Boolean(selectedType?.isCommercial),

        isFlat: Boolean(flagValues.isFlat),
        isHouseVilla: Boolean(flagValues.isHouseVilla),
        isPlot: Boolean(flagValues.isPlot),
        isCommercialUnit: Boolean(flagValues.isCommercialUnit),
      });

      resetForm();
    } catch (err) {
      alert("Failed to add property item.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property item?")) return;

    try {
      await deletePropertyItem(id);
    } catch (err) {
      alert("Failed to delete property item.");
    }
  };

  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-blue-950 dark:text-white mb-10 ml-4">
        Property Item Configuration
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* ADD FORM */}
        <motion.div
          className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 
                     border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Property Item
          </h2>

          <form onSubmit={handleAddItem} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Property Type Select */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                  Property Type <span className="text-red-600">*</span>
                </label>
                <select
                  value={item.realEstatePropertyTypeId}
                  onChange={(e) =>
                    setItem({
                      ...item,
                      realEstatePropertyTypeId: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  required
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                  Property Item Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => setItem({ ...item, name: e.target.value })}
                  placeholder="e.g., Duplex Apartment, Retail Shop"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  required
                />
              </div>

              {/* Code Select */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                  Code <span className="text-red-600">*</span>
                </label>
                <select
                  value={item.code}
                  onChange={(e) =>
                    setItem({ ...item, code: Number(e.target.value) })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  required
                >
                  <option value="">Select Code</option>
                  {unitCodes.map((u) => (
                    <option key={u.code} value={u.code}>
                      {u.name} ({u.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              **Codes:** Flat=1, House/Villa=2, Plot=3, Commercial Unit=4
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200
                           dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Reset
              </button>

              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium 
                           rounded-lg bg-blue-950 text-white hover:bg-blue-700"
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-1" /> Add Item
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* TABLE */}
        <motion.div
          className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 
                     border border-gray-200 dark:border-gray-700 overflow-x-auto"
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Property Items ({propertyItems.length})
          </h2>

          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : propertyItems.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No property items found.
            </p>
          ) : (
            <table className="w-full min-w-[650px] border-collapse">
              <thead>
                <tr className="bg-blue-950 text-white">
                  <th className="p-3 text-left text-sm">#</th>
                  <th className="p-3 text-left text-sm">Type</th>
                  <th className="p-3 text-left text-sm">Item</th>
                  <th className="p-3 text-left text-sm">Code</th>
                  <th className="p-3 text-center text-sm">Action</th>
                </tr>
              </thead>

              <tbody>
                {propertyItems.map((i, idx) => (
                  <tr
                    key={i.id}
                    className={
                      idx % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-900"
                    }
                  >
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">{i.realEstatePropertyType?.name}</td>
                    <td className="p-3">{i.name}</td>
                    <td className="p-3 font-mono">{i.code}</td>
                    <td className="p-3 text-center">
                      <button
                        className="text-red-600 hover:bg-red-100 p-1 rounded-full"
                        onClick={() => handleDelete(i.id)}
                      >
                        <FiTrash2 size={16} />
                      </button>
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

export default ConfigurePropertyItems;

import React, { useState } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useDesignationLevelsActions from "../../../../hooks/HR/Hierarchy/UseDesigantionLevels";
import useLevelsConfigActions from "../../../../hooks/HR/Hierarchy/useLevel";
import useDesignationAPI from "../../../../hooks/HR/GeneralSetup/UseDesignation";

const chipVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
};

const buttonHover = {
  scale: 1.1,
  boxShadow: "0px 0px 8px rgba(13, 42, 148, 0.6)",
};

const DesignationLevels = () => {
  const {
    designationLevels,
    loading,
    saveDesignationLevels,
    updateDesignationLevel,
    deleteDesignationLevel,
  } = useDesignationLevelsActions();

  const { levels } = useLevelsConfigActions();
  const { designations } = useDesignationAPI();

  const [formData, setFormData] = useState({
    id: null,
    levelsConfigId: "",
    designationIds: [],
  });

  const [editMode, setEditMode] = useState(false);

  const addDesignation = (id) => {
    if (!formData.designationIds.includes(id)) {
      setFormData((prev) => ({
        ...prev,
        designationIds: [...prev.designationIds, id],
      }));
    }
  };

  const removeDesignation = (id) => {
    setFormData((prev) => ({
      ...prev,
      designationIds: prev.designationIds.filter((dId) => dId !== id),
    }));
  };

  const handleLevelChange = (e) => {
    setFormData((prev) => ({ ...prev, levelsConfigId: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.levelsConfigId) {
        alert("Please select a level!");
        return;
      }
      if (formData.designationIds.length === 0) {
        alert("Please select at least one designation!");
        return;
      }

      if (editMode) {
        await updateDesignationLevel(
          formData.id,
          formData.levelsConfigId,
          formData.designationIds
        );
        alert("Updated successfully!");
      } else {
        await saveDesignationLevels(formData.levelsConfigId, formData.designationIds);
        alert("Saved successfully!");
      }

      resetForm();
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      levelsConfigId: item.levelsConfig.id,
      designationIds: item.designations.map((d) => d.id.toString()),
    });
    setEditMode(true);
  };

  const handleRemoveDesignationFromGroup = async (groupId, designationId, item) => {
    const updated = item.designations
      .filter((d) => d.id !== designationId)
      .map((d) => d.id);

    await updateDesignationLevel(groupId, item.levelsConfig.id, updated);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      levelsConfigId: "",
      designationIds: [],
    });
    setEditMode(false);
  };

  return (
    <motion.div
      className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 font-dm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-8 text-blue-950 dark:text-blue-400">
        Designation – Levels Mapping
      </h1>

      {/* FORM */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-blue-950 dark:text-blue-300">
          {editMode ? "Edit Level – Designation" : "Configure Level – Designation"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          autoComplete="off"
        >
          {/* LEVEL */}
          <div>
            <label className="font-semibold block mb-3 text-blue-950 dark:text-blue-300">
              Max Levels *
            </label>
            <select
              name="levelsConfigId"
              value={formData.levelsConfigId}
              onChange={handleLevelChange}
              className="w-full p-3 border border-blue-950 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 dark:focus:ring-blue-700 transition bg-white dark:bg-gray-700 text-blue-950 dark:text-blue-200"
            >
              <option value="" className="text-gray-600 dark:text-gray-400">
                --- Select Level ---
              </option>
              {levels.map((lvl) => (
                <option
                  key={lvl.id}
                  value={lvl.id}
                  className="text-blue-950 dark:text-blue-200"
                >
                  {lvl.maximumLevels} - {lvl.levelName}
                </option>
              ))}
            </select>
          </div>

          {/* DESIGNATIONS - custom multi-select with chips */}
          <div>
            <label className="font-semibold block mb-3 text-blue-950 dark:text-blue-300">
              Designation(s) *
            </label>
            <div className="border border-blue-950 dark:border-blue-700 rounded-lg p-3 min-h-[140px] bg-white dark:bg-gray-700 flex flex-col">
              {/* Selected chips */}
              <div className="flex flex-wrap gap-3 mb-3 min-h-[48px]">
                {formData.designationIds.length === 0 && (
                  <p className="text-gray-400 dark:text-gray-500 select-none">
                    No designation selected
                  </p>
                )}
                <AnimatePresence>
                  {formData.designationIds.map((id) => {
                    const desig = designations.find((d) => d.id.toString() === id.toString());
                    if (!desig) return null;
                    return (
                      <motion.div
                        key={id}
                        variants={chipVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex items-center bg-blue-950 dark:bg-blue-700 text-white rounded-full px-4 py-1 text-sm shadow-md cursor-default select-none"
                        whileHover={{ scale: 1.05 }}
                      >
                        {desig.name}
                        <motion.button
                          type="button"
                          onClick={() => removeDesignation(id)}
                          className="ml-3 font-bold text-white hover:text-red-400 transition"
                          aria-label={`Remove ${desig.name}`}
                          whileTap={{ scale: 0.9 }}
                        >
                          &times;
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Dropdown with all designations */}
              <select
                onChange={(e) => {
                  if (e.target.value) addDesignation(e.target.value);
                  e.target.value = "";
                }}
                className="w-full p-2 border border-blue-950 dark:border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 dark:focus:ring-blue-700 transition bg-white dark:bg-gray-700 text-blue-950 dark:text-blue-200"
                aria-label="Add designation"
                defaultValue=""
              >
                <option value="" disabled className="text-gray-600 dark:text-gray-400">
                  + Add designation
                </option>
                {designations
                  .filter((d) => !formData.designationIds.includes(d.id.toString()))
                  .map((d) => (
                    <option
                      key={d.id}
                      value={d.id}
                      className="text-blue-950 dark:text-blue-200"
                    >
                      {d.departmentName} → {d.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="col-span-2 flex gap-6 pt-5 justify-start">
            <motion.button
              type="submit"
              className="px-8 py-3 bg-blue-950 dark:bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 dark:hover:bg-blue-600 transition"
              whileHover={buttonHover}
              whileTap={{ scale: 0.95 }}
            >
              {editMode ? "Update" : "Submit"}
            </motion.button>
            <motion.button
              type="button"
              onClick={resetForm}
              className="px-8 py-3 bg-gray-500 dark:bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-600 dark:hover:bg-gray-500 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset
            </motion.button>
          </div>
        </form>
      </div>

      {/* TABLE DATA */}
      <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-blue-950 dark:text-white">
          Existing Level – Designation
        </h2>

        {loading ? (
          <p className="text-center text-blue-950 dark:text-blue-400 font-medium">Loading...</p>
        ) : (
          <div className="space-y-8">
            {designationLevels.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400">No data available</p>
            )}

            {designationLevels.map((item) => (
              <motion.div
                key={item.id}
                className="border border-blue-950 dark:border-gray-500 rounded-lg p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-xl text-blue-950 dark:text-white">
                    {item.levelsConfig.maximumLevels} - {item.levelsConfig.levelName}
                  </h3>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => handleEdit(item)}
                      className="p-3 bg-blue-950 dark:bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 dark:hover:bg-blue-600 transition"
                      aria-label={`Edit ${item.levelsConfig.levelName}`}
                      whileHover={buttonHover}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiEdit2 />
                    </motion.button>

                    <motion.button
                      onClick={() => deleteDesignationLevel(item.id)}
                      className="p-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                      aria-label={`Delete ${item.levelsConfig.levelName}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiTrash2 />
                    </motion.button>
                  </div>
                </div>

                {/* Table */}
                <table className="w-full border border-collapse border-blue-950 dark:border-blue-700 text-center">
                  <thead className="bg-blue-950 dark:bg-blue-900 text-white">
                    <tr>
                      <th className="border p-3">Sr.No</th>
                      <th className="border p-3">Department</th>
                      <th className="border p-3">Designation</th>
                      <th className="border p-3">Remove</th>
                    </tr>
                  </thead>

                  <tbody>
                    {item.designations.map((d, index) => (
                      <motion.tr
                        key={d.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="hover:bg-blue-50 dark:hover:bg-blue-900 cursor-default"
                      >
                        <td className="border p-3 text-blue-950 dark:text-white">{index + 1}</td>
                        <td className="border p-3 text-blue-950 dark:text-white">{d.department.departmentName}</td>
                        <td className="border p-3 text-blue-950 dark:text-white">{d.name}</td>
                        <td className="border p-3 text-blue-950 dark:text-white">
                          <motion.button
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            onClick={() => handleRemoveDesignationFromGroup(item.id, d.id, item)}
                            aria-label={`Remove ${d.name} from ${item.levelsConfig.levelName}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiTrash2 />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DesignationLevels;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiEdit3 } from "react-icons/fi";
import useTowerPropertyItems from "../../../hooks/propertyConfig/useTowerPropertyItems";

const ConfigureTowerPropertyItems = () => {
  const [form, setForm] = useState({
    name: "",
    code: "",
  });

  const [editId, setEditId] = useState(null);

  const {
    items,
    towerUnits,
    loading,
    addTowerItem,
    updateTowerItem,
    deleteTowerItem,
  } = useTowerPropertyItems();

  const resetForm = () => {
    setForm({ name: "", code: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.code) return alert("All fields required");

    try {
      if (editId) {
        await updateTowerItem({ id: editId, ...form });
      } else {
        await addTowerItem(form);
      }

      resetForm();
    } catch (err) {
      alert("Failed to save tower item");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Tower Property Item?")) return;

    try {
      await deleteTowerItem(id);
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <motion.div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-dm">
      <h1 className="text-3xl font-bold mb-8 text-blue-950 dark:text-white ml-4">
        Tower Property Items Configuration
      </h1>

      {/* FORM */}
      <div className="max-w-3xl mx-auto p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 mb-10">
        <h2 className="text-xl font-bold mb-5 text-blue-950 dark:text-white">
          {editId ? "Update Tower Property Item" : "Add Tower Property Item"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Item Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Balcony, Flat, Terrace"
              className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Code Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Tower Unit Code <span className="text-red-600">*</span>
            </label>

            <select
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Code</option>

              {towerUnits.map((u, i) => (
                <option key={i} value={u.code}>
                  {u.name} (Code: {u.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 rounded-lg dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              Reset
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-900 hover:bg-blue-700 text-white rounded-lg flex items-center"
            >
              <FiPlus className="mr-2" />
              {editId ? "Update Item" : "Save Item"}
            </button>
          </div>
        </form>
      </div>

      {/* LIST */}
      <div className="max-w-4xl mx-auto p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-5 text-blue-950 dark:text-white">
          Existing Tower Property Items ({items.length})
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No tower items yet.
          </p>
        ) : (
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-2 text-left text-sm">#</th>
                <th className="p-2 text-left text-sm">Name</th>
                <th className="p-2 text-left text-sm">Code</th>
                <th className="p-2 text-center text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`border-b dark:border-gray-700 ${
                      i % 2
                        ? "bg-gray-50 dark:bg-gray-900"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.code}</td>

                    <td className="p-2 text-center flex gap-3 justify-center">
                      {/* EDIT */}
                      <button
                        onClick={() => {
                          setEditId(item.id);
                          setForm({
                            name: item.name,
                            code: item.code,
                          });
                        }}
                        className="text-blue-600 hover:bg-blue-100 p-2 rounded-full"
                      >
                        <FiEdit3 size={16} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded-full"
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
      </div>
    </motion.div>
  );
};

export default ConfigureTowerPropertyItems;

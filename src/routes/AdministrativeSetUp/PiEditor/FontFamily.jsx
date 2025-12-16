import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const FontFamilyManager = () => {
  const [fontName, setFontName] = useState("");
  const [hasFontFile, setHasFontFile] = useState(false);
  const [fontFile, setFontFile] = useState(null);
  const [fontFamilies, setFontFamilies] = useState([
    { id: 1, name: "Arial", value: "Arial" },
  ]);

  const handleAddFontFamily = (e) => {
    e.preventDefault();
    if (!fontName) return;

    const newFont = {
      id: Date.now(),
      name: fontName,
      value: fontName,
    };

    setFontFamilies([newFont, ...fontFamilies]);
    setFontName("");
    setHasFontFile(false);
    setFontFile(null);
  };

  const handleDeleteFont = (id) => {
    if (window.confirm("Are you sure you want to delete this font?")) {
      setFontFamilies(fontFamilies.filter((font) => font.id !== id));
    }
  };

  const handleUpdateFont = (id) => {
    const updatedFont = prompt("Enter new font name:", fontFamilies.find(f => f.id === id)?.name);
    if (updatedFont) {
      setFontFamilies(fontFamilies.map((font) => font.id === id ? { ...font, name: updatedFont } : font));
    }
  };

  const FontCard = ({ id, name, onEdit, onDelete }) => (
    <motion.div
      className="flex justify-between items-center p-4 rounded-xl shadow-md border-2 border-dashed border-blue-600 dark:border-blue-400
        bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
      variants={itemVariants}
      whileHover={{ scale: 1.01, boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex flex-col">
        <div className="flex items-center text-lg font-semibold text-blue-950 dark:text-white">
          {name}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Edit Font"
        >
          <FiEdit size={18} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Delete Font"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen p-5 font-sans relative bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-10">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-blue-950 dark:text-white select-none" 
          variants={itemVariants}
        >
          Font Family Manager
        </motion.h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="lg:col-span-1 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Add New Font Family
          </h2>

          <form onSubmit={handleAddFontFamily} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Font Name
              </label>
              <input
                type="text"
                value={fontName}
                onChange={(e) => setFontName(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                placeholder="Enter font name"
                required
              />
            </div>

            <div className="flex items-center">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Has Font File?
              </label>
              <div className="ml-4">
                <input
                  type="radio"
                  id="yes"
                  name="hasFontFile"
                  value="yes"
                  checked={hasFontFile}
                  onChange={() => setHasFontFile(true)}
                />
                <label htmlFor="yes" className="ml-2">Yes</label>
                <input
                  type="radio"
                  id="no"
                  name="hasFontFile"
                  value="no"
                  checked={!hasFontFile}
                  onChange={() => setHasFontFile(false)}
                  className="ml-4"
                />
                <label htmlFor="no" className="ml-2">No</label>
              </div>
            </div>

            {hasFontFile && (
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Font File
                </label>
                <input
                  type="file"
                  accept=".ttf,.otf"
                  onChange={(e) => setFontFile(e.target.files[0])}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setFontName(""); setHasFontFile(false); setFontFile(null); }}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              <motion.button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700 transition-colors shadow-lg"
                whileTap={{ scale: 0.98 }}
              >
                Add Font
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.div
          className="lg:col-span-2 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Existing Font Families ({fontFamilies.length})
          </h2>

          {fontFamilies.length > 0 ? (
            <motion.div className="space-y-3" variants={containerVariants}>
              <AnimatePresence>
                {fontFamilies.map((font) => (
                  <FontCard
                    key={font.id}
                    id={font.id}
                    name={font.name}
                    onEdit={() => handleUpdateFont(font.id)}
                    onDelete={() => handleDeleteFont(font.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.p 
              className="text-center py-10 text-gray-500 dark:text-gray-400"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              No font families found. Add a new one using the form on the left.
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FontFamilyManager;

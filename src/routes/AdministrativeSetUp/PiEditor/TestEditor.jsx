import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FiSave } from "react-icons/fi";
import { FaUndo } from "react-icons/fa";

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

const TextEditorPage = () => {
  const [editorContent, setEditorContent] = useState("");
  const [savedContent, setSavedContent] = useState(null);

  const handleSaveContent = () => {
    setSavedContent(editorContent);
    alert("Content Saved!");
  };

  const handleResetContent = () => {
    setEditorContent("");
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <motion.div
      className="min-h-screen p-5 font-sans relative bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="lg:col-span-2 p-5 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Write Content
          </h2>

          <div className="space-y-5">
            <div className="dark-quill-editor">
              <ReactQuill
                value={editorContent}
                onChange={setEditorContent}
                modules={modules}
                theme="snow"
                className="h-96 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-8">
              <button
                onClick={handleResetContent}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Reset Content"
              >
                <FaUndo className="mr-1" /> Reset
              </button>
              <motion.button
                onClick={handleSaveContent}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-950 text-white hover:bg-blue-700 transition-colors shadow-lg"
                whileTap={{ scale: 0.98 }}
                aria-label="Save Content"
              >
                <FiSave className="mr-1" /> Save Content
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Saved Content Panel - now spans 1 column */}
        <motion.div
          className="lg:col-span-1 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2">
            Preview
          </h2>

          {savedContent ? (
            <motion.div
              className="p-4 rounded-lg shadow-inner bg-gray-100 dark:bg-gray-700 h-auto min-h-[300px] overflow-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div
                // Use the prose class from Tailwind Typography for rendered HTML
                className="prose max-w-none dark:prose-invert text-gray-900 dark:text-gray-100"
                dangerouslySetInnerHTML={{ __html: savedContent }}
              />
            </motion.div>
          ) : (
            <motion.p
              className="text-center py-10 text-gray-500 dark:text-gray-400"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              No content saved yet. The preview will appear here.
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TextEditorPage;

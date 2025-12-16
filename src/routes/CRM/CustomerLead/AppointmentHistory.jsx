import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMessageCircle, FiCalendar } from "react-icons/fi";

const AppointmentsHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([
    { id: 1, name: "Thor ki Wife", contact: "7878909098", via: "Email", date: "07-05-2025", remarks: "DFSD", feedback: "NAHI chahiye" },
    { id: 2, name: "Sonu", contact: "9632152452", via: "SMS", date: "09-05-2025", remarks: "Dekhi la", feedback: "ihuiuhijk  efdsafsdf" },
    { id: 3, name: "Jai", contact: "6677889900", via: "Phone Call", date: "", remarks: "High", feedback: "" },
    { id: 4, name: "Jsi Kishor Mishra", contact: "3344556677", via: "Phone Call", date: "04-05-2025", remarks: "Sir", feedback: "" },
    { id: 5, name: "Thor ki Wife", contact: "7878909098", via: "Phone Call", date: "07-05-2025", remarks: "Good", feedback: "" },
    { id: 6, name: "Test Preet Singh", contact: "6667778585", via: "Phone Call", date: "07-05-2025", remarks: "Dar", feedback: "" },
    { id: 7, name: "Ashish", contact: "7876761256", via: "SMS", date: "07-05-2025", remarks: "Ok", feedback: "" },
    { id: 8, name: "Jsi Kishor Mishra", contact: "3344556677", via: "Phone Call", date: "01-01-1970", remarks: "Ears", feedback: "" },
    { id: 9, name: "Jot jaj", contact: "4548845484", via: "Phone Call", date: "18-05-2025", remarks: "Jsbs", feedback: "" },
    { id: 10, name: "Jot jaj", contact: "4548845484", via: "Phone Call", date: "12-05-2025", remarks: "Okk", feedback: "" },
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");

  const handleFeedbackOpen = (appt) => {
    setSelectedAppointment(appt);
    setFeedbackText(appt.feedback || "");
  };

  const handleFeedbackSave = () => {
    if (selectedAppointment) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selectedAppointment.id ? { ...a, feedback: feedbackText } : a
        )
      );
    }
    setSelectedAppointment(null);
    setFeedbackText("");
  };

  const filteredAppointments = appointments.filter((a) =>
    [a.name, a.contact, a.via, a.remarks, a.feedback]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-blue-950 dark:text-white mb-6 flex items-center">
          <FiCalendar className="mr-3 text-blue-600" /> Appointment(s) / History
        </h2>

        {/* 🔍 Search Bar */}
        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-3 bg-gray-50 dark:bg-gray-700 mb-8 max-w-md">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by Name, Contact, or Remarks"
            className="w-full bg-transparent text-sm p-2 focus:outline-none text-gray-900 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 📋 Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-950 text-white text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Sr No</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Follow-Up Via</th>
                <th className="px-4 py-3">Appointment Date</th>
                <th className="px-4 py-3">Remarks</th>
                <th className="px-4 py-3">Feedback</th>
                <th className="px-4 py-3 text-center">Add Feedback</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((a, index) => (
                <tr
                  key={a.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-semibold text-blue-600">{a.name}</td>
                  <td className="px-4 py-2">{a.contact}</td>
                  <td className="px-4 py-2">{a.via}</td>
                  <td className="px-4 py-2">{a.date || "--"}</td>
                  <td className="px-4 py-2">{a.remarks}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {a.feedback || "—"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleFeedbackOpen(a)}
                      className="text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto"
                      title="Add Feedback"
                    >
                      <FiMessageCircle />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📝 Feedback Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-blue-950 dark:text-white">
                Add Feedback for {selectedAppointment.name}
              </h3>
              <textarea
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="4"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Enter feedback here..."
              />
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeedbackSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentsHistory;

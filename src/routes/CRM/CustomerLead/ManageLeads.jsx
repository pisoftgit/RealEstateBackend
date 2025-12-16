import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence for the modal
import { FiSearch, FiEye, FiTrash2, FiUserCheck, FiUsers } from "react-icons/fi";

// Function to get a dummy status (for decoration purposes)
const getStatus = (id) => {
  if (id % 3 === 0) return { label: "Converted", color: "green" };
  if (id % 5 === 0) return { label: "Follow-Up", color: "yellow" };
  return { label: "New Lead", color: "indigo" };
};

// Function to generate Tailwind classes for the status tag
const getStatusClasses = (color) => {
  switch (color) {
    case "green":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "yellow":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "indigo":
    default:
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
  }
};


const ManageLeads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState([
    { id: 1, photo: "", name: "Sonu", mobile: "9632152452", gender: "Male", address: "N/A, N/A, N/A" },
    { id: 2, photo: "", name: "Thor ki Wife", mobile: "7878909098", gender: "Female", address: "India, Punjab, Amritsar" },
    { id: 3, photo: "", name: "Ashish", mobile: "7876761256", gender: "Male", address: "N/A, N/A, N/A" },
    { id: 4, photo: "", name: "Demo testing", mobile: "0000000000", gender: "Male", address: "India, Himachal Pradesh, Solan" },
    { id: 5, photo: "", name: "Jai", mobile: "6677889900", gender: "Male", address: "India, Bihar, Araria" },
    { id: 6, photo: "", name: "Mamu SDGF SDF", mobile: "8051912324", gender: "Male", address: "Nepal, Madesh, Mahottari" },
    { id: 7, photo: "", name: "Qqq", mobile: "5454545454", gender: "Male", address: "Nepal, Madesh, Mahottari" },
    { id: 8, photo: "", name: "Jsi Kishor Mishra", mobile: "3344556677", gender: "Male", address: "Nepal, Madesh, Mahottari" },
    { id: 9, photo: "", name: "Test Preet Singh", mobile: "6667778585", gender: "Male", address: "India, Chandigarh, Chandigarh" },
    { id: 10, photo: "", name: "Test2 V 8", mobile: "0099009900", gender: "Male", address: "Nigeria, Lagos, Ajah" },
    { id: 11, photo: "", name: "Titu He JJ", mobile: "4545454545", gender: "Male", address: "Nigeria, Lagos, Ajah" },
    { id: 12, photo: "", name: "Heelo Df Df", mobile: "4543543544", gender: "Female", address: "N/A, N/A, N/A" },
    { id: 13, photo: "", name: "Heelo Df Df", mobile: "4543543544", gender: "Female", address: "N/A, N/A, N/A" },
    { id: 14, photo: "", name: "Toregee Soft Ltd", mobile: "1222334454", gender: "Male", address: "India, Chandigarh, Chandigarh" },
    { id: 15, photo: "", name: "Helloooooooo hv Jabb", mobile: "4433454545", gender: "Male", address: "India, Bihar, Araria" },
    { id: 16, photo: "", name: "Fdfdf Hf Gfd", mobile: "2345678901", gender: "Male", address: "India, Chandigarh, Chandigarh" },
    { id: 17, photo: "", name: "Jot jaj", mobile: "4548845484", gender: "Male", address: "India, Chandigarh, Chandigarh" },
    { id: 18, photo: "", name: "Lalu ji ji", mobile: "7876761234", gender: "Male", address: "N/A, N/A, N/A" },
  ]);

  const [selectedLead, setSelectedLead] = useState(null);

  const handleView = (lead) => setSelectedLead(lead);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      setLeads(leads.filter((l) => l.id !== id));
    }
  };

  const filteredLeads = leads.filter((l) =>
    [l.name, l.mobile, l.address]
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
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8"> {/* Enhanced shadow for depth */}
        <h2 className="text-3xl font-extrabold text-blue-950 dark:text-white mb-8 flex items-center border-b pb-4"> {/* Added border and padding */}
          <FiUsers className="mr-3 text-blue-600 w-8 h-8" /> Manage Customer Leads
        </h2>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-3 bg-gray-50 dark:bg-gray-700 col-span-2 shadow-sm">
            <FiSearch className="text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by Name, Mobile, or State..."
              className="w-full bg-transparent text-sm p-2 focus:outline-none text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"> {/* Added focus styles */}
              <option value="">--- FU Status ---</option>
              <option value="New">New</option>
              <option value="Follow-Up">Follow-Up</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          {/* Placeholder for another filter or action button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition text-sm">
            + Add New Lead
          </button>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto shadow-md rounded-lg"> {/* Added shadow and rounded-lg to the container */}
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-950 text-white text-xs uppercase sticky top-0"> {/* Sticky header for better scrolling experience */}
              <tr>
                <th className="px-4 py-3">Sr No</th>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3 text-center">Status</th> {/* Added Status column */}
                <th className="px-4 py-3 text-center">Actions</th> {/* Renamed 'View' to 'Actions' */}
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((l, index) => {
                const status = getStatus(l.id);
                const statusClasses = getStatusClasses(status.color);

                return (
                  <tr
                    key={l.id}
                    // 💡 Added subtle color-coded border on hover
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition border-l-4 border-transparent hover:border-blue-500 text-gray-800 dark:text-gray-200"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      {l.photo ? (
                        <img src={l.photo} alt="lead" className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-400" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs text-gray-700 dark:text-gray-300 font-medium">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 font-semibold text-blue-600 dark:text-blue-400">{l.name}</td>
                    <td className="px-4 py-2">{l.mobile}</td>
                    <td className="px-4 py-2 capitalize">{l.gender}</td>
                    <td className="px-4 py-2">{l.address}</td>
                    {/* Status Tag */}
                    <td className="px-4 py-2 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses}`}>
                        {status.label}
                      </span>
                    </td>
                    {/* Enhanced Action Buttons */}
                    <td className="px-4 py-2 text-center flex justify-center space-x-2"> {/* Used flex and space-x-2 */}
                      <button
                        onClick={() => handleView(l)}
                        className="text-blue-600 dark:text-blue-400 p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-gray-700 transition" // Added padding and hover background
                        title="View Lead"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => alert(`Convert ${l.name} to customer`)}
                        className="text-green-600 dark:text-green-400 p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-gray-700 transition" // Added padding and hover background
                        title="Convert to Customer"
                      >
                        <FiUserCheck className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="text-red-600 dark:text-red-400 p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-gray-700 transition" // Added padding and hover background
                        title="Delete Lead"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500 dark:text-gray-400"> {/* Updated colspan to 8 */}
                    No leads found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View Modal with Animation */}
        <AnimatePresence>
          {selectedLead && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> {/* Increased opacity for dark mode and added p-4 for smaller screens */}
              <motion.div
                key="lead-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-lg shadow-2xl" // Increased shadow
              >
                <h3 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white border-b pb-2"> {/* Larger heading with a subtle border */}
                  Lead Details
                </h3>
                <div className="space-y-4 text-base text-gray-800 dark:text-gray-200"> {/* Increased text size and spacing */}
                  <p><strong>Name:</strong> <span className="font-medium text-blue-600 dark:text-blue-400">{selectedLead.name}</span></p>
                  <p><strong>Mobile:</strong> {selectedLead.mobile}</p>
                  <p><strong>Gender:</strong> <span className="capitalize">{selectedLead.gender}</span></p>
                  <p><strong>Address:</strong> {selectedLead.address}</p>
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-[1.02]" // Prominent, animated close button
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ManageLeads;
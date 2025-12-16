import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiEye,
    FiEdit,
    FiUsers,
    FiUserCheck,
    FiUserX,
    FiUser
} from 'react-icons/fi';
import UpdateEmployee from './UpdateForm';

// Mock data for employees
const mockEmployees = {
    'Permanent': [
        { id: 101, photo: null, name: 'Mona Mirza', dept: 'IT Training', desig: 'Counsellor', gender: 'Female', contact: '9875983235' },
        { id: 102, photo: null, name: 'Amandeep Kaur', dept: 'IT Training', desig: 'Counsellor', gender: 'Female', contact: '9779286588' },
        { id: 103, photo: null, name: 'Anju Malhotra', dept: 'IT Development', desig: 'Project Manager', gender: 'Female', contact: '7889243833' },
        { id: 104, photo: null, name: 'Neeraj', dept: 'IT Development', desig: 'Software Developer', gender: 'Male', contact: '9625223001' },
        { id: 105, photo: null, name: 'Jatin Chawla', dept: 'Digital Marketing', desig: 'Sr. Executive', gender: 'Male', contact: '8847218419' },
    ],
    'Temporary': [
        { id: 201, photo: null, name: 'Rajesh Sahu', dept: 'HR', desig: 'HR Intern', gender: 'Male', contact: '9911223344' },
        { id: 202, photo: null, name: 'Priya Verma', dept: 'Finance', desig: 'Jr. Accountant', gender: 'Female', contact: '8800556677' },
    ],
    'Ad-Hoc': [
        { id: 301, photo: null, name: 'Sanjay Kumar', dept: 'Sales', desig: 'Contract Consultant', gender: 'Male', contact: '7771112223' },
    ],
};

// Tab definitions
const tabs = [
    { key: 'Permanent', label: 'Permanent', icon: FiUserCheck, count: mockEmployees.Permanent.length },
    { key: 'Temporary', label: 'Temporary', icon: FiUserX, count: mockEmployees.Temporary.length },
    { key: 'Ad-Hoc', label: 'Ad-Hoc', icon: FiUser, count: mockEmployees['Ad-Hoc'].length },
];

const EmployeeListComponent = () => {
    const [activeTab, setActiveTab] = useState('Permanent');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const employees = mockEmployees[activeTab];

    // View details (simple alert for demo)
    const handleView = (employee) => {
        alert(`Viewing details for ${employee.name} (ID: ${employee.id})`);
    };

    // Open update modal
    const handleEdit = (employee) => {
        setFormData(employee);
        setIsModalOpen(true);
    };

    // Save updated data
    const handleSave = () => {
        console.log('Updated employee data:', formData);
        alert(`Updated details for ${formData.name}`);
        setIsModalOpen(false);
    };

    // Tab button component
    const TabButton = ({ tab }) => (
        <motion.button
            key={tab.key}
            className={`px-6 py-3 font-semibold text-sm transition-colors relative flex items-center justify-center ${
                activeTab === tab.key
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
            onClick={() => setActiveTab(tab.key)}
            whileTap={{ scale: 0.98 }}
        >
            <tab.icon className="w-5 h-5 mr-2" />
            {tab.label}
            <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {tab.count}
            </span>
            {activeTab === tab.key && (
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-lg"
                    layoutId="underline"
                />
            )}
        </motion.button>
    );

    // Employee table
    const EmployeeTable = ({ data }) => (
        <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-x-auto"
        >
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        {['Photo', 'Name', 'Department', 'Designation', 'Gender', 'Contact', 'Actions'].map((h) => (
                            <th
                                key={h}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {data.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4">
                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                    <FiUser size={16} className="text-gray-500 dark:text-gray-400" />
                                </div>
                            </td>
                            <td className="px-6 py-4">{employee.name}</td>
                            <td className="px-6 py-4">{employee.dept}</td>
                            <td className="px-6 py-4">{employee.desig}</td>
                            <td className="px-6 py-4">{employee.gender}</td>
                            <td className="px-6 py-4">{employee.contact}</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex justify-center space-x-2">
                                    <motion.button
                                        onClick={() => handleView(employee)}
                                        className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 rounded-full hover:bg-green-50 dark:hover:bg-gray-700 transition"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <FiEye size={18} />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleEdit(employee)}
                                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <FiEdit size={18} />
                                    </motion.button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    );

    return ( 
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <FiUsers className="mr-3 text-blue-600" /> Employee List
                    </h2>
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    {tabs.map(tab => <TabButton key={tab.key} tab={tab} />)}
                </div>

                <div className="p-4 sm:p-6">
                    <AnimatePresence mode="wait">
                        <EmployeeTable data={employees} />
                    </AnimatePresence>
                </div>
            </div>

            <UpdateEmployee
                isOpen={isModalOpen}
                employeeData={formData}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                setFormData={setFormData}
            />
        </div>
    );
};

export default EmployeeListComponent;

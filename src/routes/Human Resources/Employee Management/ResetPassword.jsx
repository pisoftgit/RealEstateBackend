import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    FiLock, FiRefreshCw, FiUser, FiEye, FiEyeOff, FiAlertTriangle
} from 'react-icons/fi';

const initialEmployeeData = [
    { srNo: 1, id: '01035203000003', name: 'Vaishnavi Khushdil', dept: 'IT Training', desig: 'Counsellor', currentPass: '7876203713' },
    { srNo: 2, id: '01035203000004', name: 'Rajveer Singh', dept: 'IT Training', desig: 'Jr.Trainer', currentPass: '7470848002' },
    { srNo: 3, id: '01035203000005', name: 'Ravinder Kaur', dept: 'IT Training', desig: 'Counsellor', currentPass: '7560062671' },
    { srNo: 4, id: '01035203000006', name: 'Sanmeet', dept: 'IT Training', desig: 'Jr.Trainer', currentPass: '9914921802' },
    { srNo: 5, id: '01035203000007', name: 'Mona Mirza', dept: 'IT Training', desig: 'Counsellor', currentPass: '9875983235' },
    { srNo: 6, id: '01035203000008', name: 'Amandeep Kaur', dept: 'IT Training', desig: 'Counsellor', currentPass: '9779286588' },
    { srNo: 16, id: '01035203000019', name: 'Harish Chawla', dept: 'IT Training', desig: 'Vice President', currentPass: 'HelloPisoft@468' },
    { srNo: 39, id: 'fazleali1458@gmail.com', name: 'Fazle Ali', dept: 'IT Development', desig: 'Jr Graphic Designer', currentPass: '9572149809' },
];

const EmployeePasswordManagement = () => {
    const [passwordVisibility, setPasswordVisibility] = useState({});
    const [employees, setEmployees] = useState(initialEmployeeData); 

    const togglePasswordVisibility = (id) => {
        setPasswordVisibility(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleResetPassword = (employee) => {
        const newPassword = Math.random().toString(36).slice(-8);
        
        // Confirmation before proceeding
        if (!window.confirm(`Are you sure you want to reset the password for ${employee.name}?`)) {
            return;
        }

        console.log(`Resetting password for: ${employee.name} (ID: ${employee.id})`);
        
        // SIMULATION: Update the employee's password in the local state
        setEmployees(prev => prev.map(emp => 
            emp.id === employee.id ? { ...emp, currentPass: newPassword } : emp
        ));

        alert(
            `SUCCESS: Password for ${employee.name} has been reset to: ${newPassword}. (In a live system, this would be encrypted and communicated securely.)`
        );
    };

    return (
        <motion.div 
            className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <FiLock className="mr-3 text-blue-500" /> Employee Credentials
                    </h2>
                </div>
                
                {/* --- Responsive Table Container (Fixes Overflow) --- */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-blue-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-blue-700 dark:text-gray-300 uppercase tracking-wider w-12">Sr No</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-blue-700 dark:text-gray-300 uppercase tracking-wider">ID / Name</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-blue-700 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Dept. / Desig.</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-blue-700 dark:text-gray-300 uppercase tracking-wider">Current Password</th>
                                <th className="px-3 sm:px-6 py-3 text-center text-xs font-semibold text-blue-700 dark:text-gray-300 uppercase tracking-wider">Reset</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700">
                            {employees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-blue-50/50 dark:hover:bg-gray-700 transition-colors">
                                    {/* Sr No */}
                                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-medium">{employee.srNo}</td>
                                    
                                    {/* ID / Name Column (Combined for space) */}
                                    <td className="px-3 sm:px-6 py-3">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                                <FiUser size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{employee.name}</p>
                                                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">{employee.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    {/* Dept. / Desig. Column (Hidden on small screens) */}
                                    <td className="px-3 sm:px-6 py-3 hidden md:table-cell">
                                        <p className="text-sm text-gray-900 dark:text-white">{employee.dept}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{employee.desig}</p>
                                    </td>
                                    
                                    {/* Current Password Column */}
                                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-mono text-blue-500 dark:text-blue-400">
                                                {passwordVisibility[employee.id] ? employee.currentPass : '••••••••••••'}
                                            </span>
                                            <motion.button
                                                type="button"
                                                onClick={() => togglePasswordVisibility(employee.id)}
                                                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded-full"
                                                whileTap={{ scale: 0.9 }}
                                                title={passwordVisibility[employee.id] ? "Hide Password" : "Show Password"}
                                            >
                                                {passwordVisibility[employee.id] ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                            </motion.button>
                                        </div>
                                    </td>
                                    
                                    {/* Reset Action Column */}
                                    <td className="px-3 sm:px-6 py-3 text-center whitespace-nowrap">
                                        <motion.button
                                            onClick={() => handleResetPassword(employee)}
                                            className="px-4 py-1.5 inline-flex items-center justify-center text-xs font-semibold text-white bg-blue-950 rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            title={`Reset Password for ${employee.name}`}
                                        >
                                            <FiRefreshCw size={14} className="mr-1" /> Reset
                                        </motion.button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {employees.length === 0 && (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        No existing employees found.
                    </div>
                )}

            </div>
        </motion.div>
    );
};

export default EmployeePasswordManagement;
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiCalendar, FiFilter, FiSave, FiClock, FiTag, FiFileText, FiChevronDown, FiChevronUp, FiUsers, FiCheckCircle
} from 'react-icons/fi';

// --- Static Data Definitions (Same as before) ---
const DEPARTMENTS = ['Accounts', 'Digital Marketing', 'IT Development', 'IT Training', 'Operations', 'Sales and Marketing'];

const ATTENDANCE_NOTATIONS = [
    { key: 'P', label: 'Present', color: 'bg-green-500 hover:bg-green-600', text: 'text-white', ring: 'ring-green-500', darkColor: 'bg-green-700' },
    { key: 'A', label: 'Absent', color: 'bg-red-500 hover:bg-red-600', text: 'text-white', ring: 'ring-red-500', darkColor: 'bg-red-700' },
    { key: 'SL', label: 'Short Leave', color: 'bg-yellow-400 hover:bg-yellow-500', text: 'text-gray-900', ring: 'ring-yellow-400', darkColor: 'bg-yellow-600' },
    { key: 'HD', label: 'Half Day', color: 'bg-orange-500 hover:bg-orange-600', text: 'text-white', ring: 'ring-orange-500', darkColor: 'bg-orange-700' },
    { key: 'FD', label: 'Full Day', color: 'bg-indigo-500 hover:bg-indigo-600', text: 'text-white', ring: 'ring-indigo-500', darkColor: 'bg-indigo-700' },
    { key: 'OT', label: 'Official Tour', color: 'bg-purple-500 hover:bg-purple-600', text: 'text-white', ring: 'ring-purple-500', darkColor: 'bg-purple-700' },
    { key: 'ML', label: 'Medical Leave', color: 'bg-teal-500 hover:bg-teal-600', text: 'text-white', ring: 'ring-teal-500', darkColor: 'bg-teal-700' },
    { key: 'CL', label: 'Casual Leave', color: 'bg-pink-500 hover:bg-pink-600', text: 'text-white', ring: 'ring-pink-500', darkColor: 'bg-pink-700' },
    { key: 'H', label: 'Holiday', color: 'bg-gray-400 hover:bg-gray-500', text: 'text-gray-900', ring: 'ring-gray-400', darkColor: 'bg-gray-600' },
];

const initialEmployees = [
    { id: '01035203000085', name: 'Jyoti Rana', desig: 'Training & Placement Manager', department: 'IT Training' },
    { id: '01035203000003', name: 'Vaishnavi Khushdil', desig: 'Counsellor', department: 'IT Training' },
    { id: '01035203000004', name: 'Rajveer Singh', desig: 'Jr.Trainer', department: 'IT Training' },
    { id: '01035203000014', name: 'Anju Malhotra', desig: 'Project Manager', department: 'IT Development' },
    { id: 'vivam30@gmail.com', name: 'Vineet Mishra', desig: 'Accounts Manager', department: 'Accounts' },
    // Added more employees for better scrolling/testing responsiveness
    { id: '01035203000020', name: 'Priya Sharma', desig: 'Lead Developer', department: 'IT Development' },
    { id: '01035203000035', name: 'Harsh Gupta', desig: 'Digital Strategist', department: 'Digital Marketing' },
    { id: '01035203000050', name: 'Komal Mehra', desig: 'Sales Executive', department: 'Sales and Marketing' },
    { id: '01035203000062', name: 'Sanjay Dutt', desig: 'System Administrator', department: 'Operations' },
    { id: '01035203000077', name: 'Neelam Verma', desig: 'HR Specialist', department: 'Operations' },
];

// Helper component for the filter controls
const FilterControl = ({ label, children }) => (
    <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{label}</label>
        {children}
    </div>
);


const DailyAttendanceMarker = () => {
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today
    const [filters, setFilters] = useState({ dept: '', desig: '', code: '' });
    const [attendanceMarks, setAttendanceMarks] = useState({});
    const [isLegendOpen, setIsLegendOpen] = useState(false);

    // --- Handlers ---
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleMarkChange = (empId, mark) => {
        setAttendanceMarks(prev => ({ ...prev, [empId]: mark }));
    };
    
    // NEW: Function to Mark All Present
    const handleMarkAllPresent = () => {
        const newMarks = {};
        filteredEmployees.forEach(emp => {
            newMarks[emp.id] = 'P';
        });
        setAttendanceMarks(newMarks);
    };


    const handleSaveAttendance = () => {
        const unmarkedEmployees = initialEmployees.filter(emp => !attendanceMarks[emp.id]);
        
        if (unmarkedEmployees.length > 0) {
            if (!window.confirm(`WARNING: ${unmarkedEmployees.length} employee(s) are not marked. Do you want to save anyway?`)) {
                return;
            }
        }

        console.log("Saving attendance for date:", attendanceDate, "Data:", attendanceMarks);
        alert(`Attendance for ${Object.keys(attendanceMarks).length} employees on ${attendanceDate} saved! (Simulation complete)`);
    };

    // --- Filtering Logic (useMemo for performance) ---
    const filteredEmployees = useMemo(() => {
        return initialEmployees.filter(emp => {
            const deptMatch = !filters.dept || emp.department === filters.dept;
            const desigMatch = !filters.desig || emp.desig.toLowerCase().includes(filters.desig.toLowerCase());
            const codeMatch = !filters.code || emp.id.includes(filters.code);
            return deptMatch && desigMatch && codeMatch;
        });
    }, [filters]);

    const formatDateDisplay = (dateStr) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    }

    // Determine the notation object for a given key
    const getNotation = (key) => ATTENDANCE_NOTATIONS.find(n => n.key === key);

    return (
        <motion.div 
            className="p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header and Primary Controls */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 flex items-center mb-4 md:mb-0">
                        <FiFileText className="mr-3" /> Daily Attendance Marker
                    </h2>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                        {/* Date Selector */}
                        <div className="flex-shrink-0">
                            <label htmlFor="attendanceDate" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Attendance Date</label>
                            <input
                                type="date"
                                id="attendanceDate"
                                name="attendanceDate"
                                value={attendanceDate}
                                onChange={(e) => setAttendanceDate(e.target.value)}
                                className="w-full sm:w-auto py-2 px-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                max={new Date().toISOString().slice(0, 10)}
                            />
                        </div>
                        
                        {/* Mark All Present Button (Added UX improvement) */}
                         <motion.button
                            onClick={handleMarkAllPresent}
                            className="px-4 py-2 flex items-center text-sm text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-150 font-semibold h-10"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiCheckCircle size={18} className="mr-2" /> Mark All 'P'
                        </motion.button>
                    </div>
                </header>
                
                {/* --- Search and Filter Section --- */}
                <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiFilter className="mr-2 text-blue-500" size={18} /> Filter Employees
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 md:gap-6">
                        <FilterControl label="DEPARTMENT">
                            <select
                                id="dept"
                                name="dept"
                                value={filters.dept}
                                onChange={handleFilterChange}
                                className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">All Departments</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </FilterControl>

                        <FilterControl label="DESIGNATION KEYWORD">
                            <input
                                type="text"
                                id="desig"
                                name="desig"
                                placeholder="e.g., Manager"
                                value={filters.desig}
                                onChange={handleFilterChange}
                                className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </FilterControl>

                        <FilterControl label="EMPLOYEE ID">
                            <input
                                type="text"
                                id="code"
                                name="code"
                                placeholder="e.g., 01035"
                                value={filters.code}
                                onChange={handleFilterChange}
                                className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </FilterControl>
                    </div>
                </div>

                {/* --- Attendance Legend (Collapsible) --- */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={() => setIsLegendOpen(!isLegendOpen)}
                        className="w-full p-3 flex justify-between items-center text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <span className="flex items-center"><FiTag className="mr-2 text-blue-500" size={16} /> Attendance Notation Legend</span>
                        {isLegendOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    
                    <AnimatePresence>
                        {isLegendOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden border-t dark:border-gray-700"
                            >
                                <div className="p-3">
                                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 text-xs">
                                        {ATTENDANCE_NOTATIONS.map(notation => (
                                            <div key={notation.key} className="flex flex-col items-center p-1 rounded-lg text-center bg-gray-50 dark:bg-gray-700/50">
                                                <span className={`h-4 w-4 rounded-full mb-1 ${notation.color.split(' ')[0]} ${notation.darkColor}`} aria-hidden="true"></span>
                                                <span className="text-gray-700 dark:text-gray-300 font-bold">{notation.key}</span>
                                                <span className="text-gray-500 dark:text-gray-400 text-[10px]">{notation.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>


                {/* --- Main Attendance Table --- */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="p-4 bg-blue-50 dark:bg-gray-700/50 flex justify-between items-center">
                         <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center">
                             <FiClock className="mr-2" /> Marking for: {formatDateDisplay(attendanceDate)}
                         </h3>
                         <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total: {filteredEmployees.length}</span>
                    </div>

                    {/* Attendance Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-12">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider min-w-[150px]">Employee Details</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider min-w-[300px]">Mark Attendance</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-24">Current Mark</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700">
                                {filteredEmployees.map((employee, index) => {
                                    const currentMark = attendanceMarks[employee.id];
                                    const notation = getNotation(currentMark);

                                    return (
                                        <tr 
                                            key={employee.id} 
                                            className={`transition-colors ${currentMark === 'A' ? 'bg-red-50 dark:bg-red-900/20' : 'hover:bg-blue-50/50 dark:hover:bg-gray-700'}`}
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 font-medium align-top pt-5">{index + 1}</td>
                                            
                                            {/* Employee Name & Details */}
                                            <td className="px-4 py-3 text-sm align-top">
                                                <p className="font-semibold text-gray-900 dark:text-white">{employee.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{employee.desig}</p>
                                                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-1">{employee.id}</p>
                                            </td>
                                            
                                            {/* Attendance Marking Buttons (Responsive) */}
                                            <td className="px-4 py-3 text-center align-top pt-5">
                                                <div className="flex flex-wrap justify-center gap-1.5 max-w-[320px] mx-auto">
                                                    {ATTENDANCE_NOTATIONS.map(n => (
                                                        <motion.button
                                                            key={n.key}
                                                            type="button"
                                                            onClick={() => handleMarkChange(employee.id, n.key)}
                                                            className={`w-9 h-7 text-xs font-semibold rounded-md border transition-all duration-150 shadow-sm
                                                                ${currentMark === n.key 
                                                                    ? `${n.color} ${n.text} ring-2 ${n.ring} border-transparent`
                                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
                                                                }`
                                                            }
                                                            whileTap={{ scale: 0.95 }}
                                                            title={n.label}
                                                        >
                                                            {n.key}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </td>
                                            
                                            {/* Current Mark Display */}
                                            <td className="px-4 py-3 text-center align-top pt-5">
                                                {currentMark ? (
                                                     <p className={`w-full text-sm font-bold ${notation?.text} rounded-lg inline-block py-1 ${notation?.color} dark:${notation?.darkColor} shadow-md`}>
                                                        {currentMark}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm font-medium text-gray-400 dark:text-gray-500 italic">Unmarked</p>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredEmployees.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <FiUsers className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                            <p className="font-semibold">No employees match the current filter criteria.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sticky Save Button at the bottom for easy access */}
                <div className="fixed bottom-4 right-4 z-20">
                    <motion.button
                        onClick={handleSaveAttendance}
                        className="px-6 py-3 flex items-center text-white bg-green-600 rounded-full shadow-2xl hover:bg-green-700 transition duration-150 font-bold text-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FiSave size={20} className="mr-2" /> Save Attendance
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default DailyAttendanceMarker;
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiSave, FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

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
  { id: '01035203000020', name: 'Priya Sharma', desig: 'Lead Developer', department: 'IT Development' },
  { id: '01035203000035', name: 'Harsh Gupta', desig: 'Digital Strategist', department: 'Digital Marketing' },
  { id: '01035203000050', name: 'Komal Mehra', desig: 'Sales Executive', department: 'Sales and Marketing' },
  { id: '01035203000062', name: 'Sanjay Dutt', desig: 'System Administrator', department: 'Operations' },
  { id: '01035203000077', name: 'Neelam Verma', desig: 'HR Specialist', department: 'Operations' },
];

// Helper for getting days in a month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper for weekday abbreviation
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Filter control component
const FilterControl = ({ label, children }) => (
  <div className="flex-1 min-w-[150px]">
    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{label}</label>
    {children}
  </div>
);

const MonthlyAttendanceGrid = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based
  const [filters, setFilters] = useState({ dept: '', desig: '', code: '' });
  // Structure: { empId: { dayNumber: 'P' } }
  const [attendanceMarks, setAttendanceMarks] = useState({});
  // Popup state: { empId, day } or null
  const [popup, setPopup] = useState(null);
  // Legend toggle
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  // Ref for click outside popup detection
  const popupRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popupRef]);

  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);

  // Filtering employees
  const filteredEmployees = useMemo(() => {
    return initialEmployees.filter(emp => {
      const deptMatch = !filters.dept || emp.department === filters.dept;
      const desigMatch = !filters.desig || emp.desig.toLowerCase().includes(filters.desig.toLowerCase());
      const codeMatch = !filters.code || emp.id.includes(filters.code);
      return deptMatch && desigMatch && codeMatch;
    });
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Mark attendance for one cell
  const handleMarkChange = (empId, day, mark) => {
    setAttendanceMarks(prev => {
      const empMarks = prev[empId] ? {...prev[empId]} : {};
      empMarks[day] = mark;
      return {...prev, [empId]: empMarks};
    });
    setPopup(null);
  };

  // Mark all present for filtered employees and all days
  const handleMarkAllPresent = () => {
    setAttendanceMarks(prev => {
      const newMarks = {...prev};
      filteredEmployees.forEach(emp => {
        const empMarks = newMarks[emp.id] ? {...newMarks[emp.id]} : {};
        for(let d=1; d<=daysInMonth; d++) {
          empMarks[d] = 'P';
        }
        newMarks[emp.id] = empMarks;
      });
      return newMarks;
    });
  };

  // Save handler with warnings
  const handleSaveAttendance = () => {
    const unmarkedCells = [];
    filteredEmployees.forEach(emp => {
      for(let d=1; d<=daysInMonth; d++) {
        if(!attendanceMarks[emp.id]?.[d]) {
          unmarkedCells.push({emp, day: d});
        }
      }
    });

    if (unmarkedCells.length > 0) {
      if(!window.confirm(`WARNING: ${unmarkedCells.length} attendance cell(s) are not marked. Save anyway?`)) {
        return;
      }
    }
    console.log('Saving Attendance for:', { year, month: month + 1 }, attendanceMarks);
    alert(`Saved attendance for ${filteredEmployees.length} employees, month: ${month + 1}/${year}. (Simulation)`);
  };

  // Get notation object by key
  const getNotation = (key) => ATTENDANCE_NOTATIONS.find(n => n.key === key);

  // Generate month-year options for selection (last 5 years to next year)
  const yearOptions = [];
  for(let y = today.getFullYear() - 5; y <= today.getFullYear() + 1; y++) yearOptions.push(y);

  return (
    <div className="p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 flex items-center mb-4 md:mb-0">
            Existing View Attendance &nbsp;
            <span className="text-sm text-red-600 font-semibold">{month + 1}-{year}</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <FilterControl label="Department">
              <select
                className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="dept" value={filters.dept} onChange={handleFilterChange}
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </FilterControl>

            <FilterControl label="Designation">
              <input
                type="text"
                placeholder="Search designation"
                className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="desig" value={filters.desig} onChange={handleFilterChange}
              />
            </FilterControl>

            <FilterControl label="Employee Code">
              <input
                type="text"
                placeholder="Search employee code"
                className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="code" value={filters.code} onChange={handleFilterChange}
              />
            </FilterControl>

            <FilterControl label="Year">
              <select
                className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={year}
                onChange={e => setYear(+e.target.value)}
              >
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </FilterControl>

            <FilterControl label="Month">
              <select
                className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={month}
                onChange={e => setMonth(+e.target.value)}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
                ))}
              </select>
            </FilterControl>
          </div>
        </header>

        {/* Buttons */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleMarkAllPresent}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow transition"
            title="Mark all as Present"
          >
            Mark All Present
          </button>

          <button
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition"
          >
            Legend {isLegendOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow transition"
            title="Save Attendance"
          >
            <FiSave className="inline mr-2" /> Save Attendance
          </button>
        </div>

        {/* Legend */}
        <AnimatePresence>
          {isLegendOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-sm text-gray-700 dark:text-gray-300"
            >
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {ATTENDANCE_NOTATIONS.map(({ key, label, color, text }) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs cursor-default select-none ${color} ${text}`}>
                      {key}
                    </div>
                    <div>{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attendance Table */}
        <div className="overflow-auto border border-gray-300 dark:border-gray-700 rounded-lg max-h-[600px]">
          <table className="w-full border-collapse table-fixed text-sm">
            <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0 z-20">
              <tr>
                <th className="sticky left-0 bg-gray-200 dark:bg-gray-700 z-30 border border-gray-300 dark:border-gray-600 px-2 py-1 w-[45px] text-center">#</th>
                <th className="sticky left-[45px] bg-gray-200 dark:bg-gray-700 z-30 border border-gray-300 dark:border-gray-600 px-2 py-1 min-w-[130px] text-left">Code</th>
                <th className="sticky left-[175px] bg-gray-200 dark:bg-gray-700 z-30 border border-gray-300 dark:border-gray-600 px-2 py-1 min-w-[180px] text-left">Name</th>
                {[...Array(daysInMonth)].map((_, idx) => {
                  const day = idx + 1;
                  const weekday = WEEKDAYS[new Date(year, month, day).getDay()];
                  return (
                    <th
                      key={day}
                      className={`border border-gray-300 dark:border-gray-600 px-1 py-1 w-[30px] text-center select-none`}
                      title={`${weekday}, ${day}-${month + 1}-${year}`}
                    >
                      <div className="text-xs font-semibold">{day}</div>
                      <div className="text-[9px] font-mono">{weekday}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={3 + daysInMonth} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No employees found for filters.
                  </td>
                </tr>
              ) : filteredEmployees.map((emp, i) => (
                <tr key={emp.id} className="even:bg-gray-100 dark:even:bg-gray-800">
                  <td className="sticky left-0 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-2 py-1 text-center">{i + 1}</td>
                  <td className="sticky left-[45px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-2 py-1 text-sm font-mono">{emp.id}</td>
                  <td className="sticky left-[175px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-2 py-1 font-medium">{emp.name}</td>
                  {[...Array(daysInMonth)].map((_, idx) => {
                    const day = idx + 1;
                    const mark = attendanceMarks[emp.id]?.[day];
                    const notation = getNotation(mark);
                    return (
                      <td
                        key={day}
                        className={`cursor-pointer select-none border border-gray-300 dark:border-gray-700 px-1 py-[6px] text-center relative ${
                          notation ? `${notation.color} ${notation.text}` : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopup({ empId: emp.id, day, rect: e.currentTarget.getBoundingClientRect() });
                        }}
                        title={notation ? `${notation.label} (${mark})` : 'Click to mark attendance'}
                      >
                        {mark || ''}
                        {popup && popup.empId === emp.id && popup.day === day && (
                          <AttendancePopup
                            ref={popupRef}
                            notationList={ATTENDANCE_NOTATIONS}
                            onSelect={key => handleMarkChange(emp.id, day, key)}
                            parentRect={popup.rect}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Popup component
const AttendancePopup = React.forwardRef(({ notationList, onSelect, parentRect }, ref) => {
  // Calculate position for popup below cell, with some offset
  const style = {
    position: 'fixed',
    top: parentRect.bottom + 6,
    left: parentRect.left,
    zIndex: 9999,
    minWidth: 120,
  };

  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-2 flex flex-wrap gap-1"
      role="listbox"
      aria-label="Attendance options"
    >
      {notationList.map(({ key, label, color, text, ring }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex-1 text-center rounded-md font-bold text-sm cursor-pointer select-none px-1 py-1 ${color} ${text} focus:outline-none focus:ring-2 ${ring}`}
          title={label}
          type="button"
        >
          {key}
        </button>
      ))}
    </motion.div>
  );
});

export default MonthlyAttendanceGrid;

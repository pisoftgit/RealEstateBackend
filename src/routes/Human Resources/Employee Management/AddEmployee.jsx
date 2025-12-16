import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FiUserPlus, FiMapPin, FiBookOpen, FiBriefcase, 
    FiPaperclip, FiTrash2, FiPlus, FiSave, FiUser 
} from "react-icons/fi";

// --- Styling Constants ---
const inputClass = "w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm";
const labelClass = "block font-semibold mb-1 text-gray-700 dark:text-gray-300 text-sm";
const cardClass = "p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm";
const sectionTitleClass = "text-xl font-bold mb-4 text-blue-950 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2";

// --- Address Fields Component ---
const AddressFields = ({ address, sectionName, handleChange, isCorrespondence, sameAsPermanent, handleSameAsPermanent }) => {
    return (
        <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="font-bold mb-2 text-blue-950 dark:text-white">
                {sectionName}
            </h3>
            
            {isCorrespondence && (
                <label className="flex items-center mb-4 text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={sameAsPermanent}
                        onChange={handleSameAsPermanent}
                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    Same as Permanent Address
                </label>
            )}

            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Address Line 1"
                    name="line1"
                    value={address.line1 || ""}
                    onChange={(e) => handleChange(e, sectionName === 'Permanent Address' ? 'permanentAddress' : 'correspondenceAddress', 'line1')}
                    disabled={isCorrespondence && sameAsPermanent}
                    className={`${inputClass} ${(isCorrespondence && sameAsPermanent) ? "bg-gray-100 dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700" : ""}`}
                    required
                />
                <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    name="line2"
                    value={address.line2 || ""}
                    onChange={(e) => handleChange(e, sectionName === 'Permanent Address' ? 'permanentAddress' : 'correspondenceAddress', 'line2')}
                    disabled={isCorrespondence && sameAsPermanent}
                    className={`${inputClass} ${(isCorrespondence && sameAsPermanent) ? "bg-gray-100 dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700" : ""}`}
                />
                <select
                    name="country"
                    value={address.country || ""}
                    onChange={(e) => handleChange(e, sectionName === 'Permanent Address' ? 'permanentAddress' : 'correspondenceAddress', 'country')}
                    disabled={isCorrespondence && sameAsPermanent}
                    className={`${inputClass} ${(isCorrespondence && sameAsPermanent) ? "bg-gray-100 dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700" : ""}`}
                    required
                >
                    <option value="">--- Select Country ---</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                </select>
                <input
                    type="text"
                    placeholder="City / Zip Code (Optional)"
                    name="city"
                    value={address.city || ""}
                    onChange={(e) => handleChange(e, sectionName === 'Permanent Address' ? 'permanentAddress' : 'correspondenceAddress', 'city')}
                    disabled={isCorrespondence && sameAsPermanent}
                    className={`${inputClass} ${(isCorrespondence && sameAsPermanent) ? "bg-gray-100 dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700" : ""}`}
                />
            </div>
        </div>
    );
}

// --- Spouse Details Component ---
const SpouseDetailsForm = ({ employee, handleChange }) => (
    <div className={cardClass}>
        <h4 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-4 flex items-center"><FiUser className="mr-2" /> Spouse Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
                <label className={labelClass}>Name *</label>
                <input type="text" name="spouseName" value={employee.spouseDetails.name} onChange={(e) => handleChange(e, 'spouseDetails', 'name')} className={inputClass} required />
            </div>
            <div>
                <label className={labelClass}>DOB (dd-mm-yyyy)</label>
                <input type="date" name="spouseDOB" value={employee.spouseDetails.dob} onChange={(e) => handleChange(e, 'spouseDetails', 'dob')} className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Occupation</label>
                <input type="text" name="spouseOccupation" value={employee.spouseDetails.occupation} onChange={(e) => handleChange(e, 'spouseDetails', 'occupation')} className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Qualification</label>
                <input type="text" name="spouseQualification" value={employee.spouseDetails.qualification} onChange={(e) => handleChange(e, 'spouseDetails', 'qualification')} className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Contact</label>
                <input type="text" name="spouseContact" value={employee.spouseDetails.contact} onChange={(e) => handleChange(e, 'spouseDetails', 'contact')} className={inputClass} />
            </div>
        </div>
    </div>
);

// --- Children Details Component ---
const ChildrenDetailsForm = ({ children, setChildren }) => {
    const defaultChild = { name: '', dob: '', occupation: '', qualification: '', contact: '' };
    
    const addChild = () => setChildren(prev => [...prev, { ...defaultChild, id: Date.now() }]);
    const removeChild = (id) => setChildren(prev => prev.filter(c => c.id !== id));
    
    const handleChildChange = (id, name, value) => {
        setChildren(prev => prev.map(c => c.id === id ? { ...c, [name]: value } : c));
    };

    return (
        <div className={cardClass}>
            <h4 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                <FiUser className="mr-2" /> Children Details
                <motion.button type="button" onClick={addChild} className="ml-4 p-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center" whileTap={{ scale: 0.95 }}>
                    <FiPlus className="mr-1" size={12}/> Add Child
                </motion.button>
            </h4>
            
            <AnimatePresence initial={false}>
                {children.map((child, index) => (
                    <motion.div 
                        key={child.id}
                        className="p-3 mb-3 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">Child {index + 1}</p>
                            <motion.button type="button" onClick={() => removeChild(child.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full" whileTap={{ scale: 0.9 }}>
                                <FiTrash2 size={14} />
                            </motion.button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                            <div><label className={labelClass}>Name *</label><input type="text" value={child.name} onChange={(e) => handleChildChange(child.id, 'name', e.target.value)} className={inputClass} required={index === 0} /></div>
                            <div><label className={labelClass}>DOB</label><input type="date" value={child.dob} onChange={(e) => handleChildChange(child.id, 'dob', e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Occupation</label><input type="text" value={child.occupation} onChange={(e) => handleChildChange(child.id, 'occupation', e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Qualification</label><input type="text" value={child.qualification} onChange={(e) => handleChildChange(child.id, 'qualification', e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Contact</label><input type="text" value={child.contact} onChange={(e) => handleChildChange(child.id, 'contact', e.target.value)} className={inputClass} /></div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// --- Education Details Component ---
const EducationDetailsForm = ({ education, setEducation }) => {
    const defaultEducation = { university: '', stream: '', totalMarks: '', obtainedMarks: '', passingYear: '', status: '' };
    
    const addEducation = () => setEducation(prev => [...prev, { ...defaultEducation, id: Date.now() }]);
    const removeEducation = (id) => setEducation(prev => prev.filter(e => e.id !== id));
    
    const handleEducationChange = (id, name, value) => {
        setEducation(prev => prev.map(e => e.id === id ? { ...e, [name]: value } : e));
    };

    return (
        <div className={cardClass}>
            <h4 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                <FiBookOpen className="mr-2" /> Education Details
                <motion.button type="button" onClick={addEducation} className="ml-4 p-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center" whileTap={{ scale: 0.95 }}>
                    <FiPlus className="mr-1" size={12}/> Add Degree/Course
                </motion.button>
            </h4>
            
            <AnimatePresence initial={false}>
                {education.map((edu, index) => (
                    <motion.div 
                        key={edu.id}
                        className="p-3 mb-3 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">Education {index + 1}</p>
                            <motion.button type="button" onClick={() => removeEducation(edu.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full" whileTap={{ scale: 0.9 }}>
                                <FiTrash2 size={14} />
                            </motion.button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                            <div><label className={labelClass}>University/Board *</label><input type="text" value={edu.university} onChange={(e) => handleEducationChange(edu.id, 'university', e.target.value)} className={inputClass} required /></div>
                            <div><label className={labelClass}>Stream/Class *</label><input type="text" value={edu.stream} onChange={(e) => handleEducationChange(edu.id, 'stream', e.target.value)} className={inputClass} required /></div>
                            <div><label className={labelClass}>Total Marks *</label><input type="number" value={edu.totalMarks} onChange={(e) => handleEducationChange(edu.id, 'totalMarks', e.target.value)} className={inputClass} required /></div>
                            <div><label className={labelClass}>Obtained Marks *</label><input type="number" value={edu.obtainedMarks} onChange={(e) => handleEducationChange(edu.id, 'obtainedMarks', e.target.value)} className={inputClass} required /></div>
                            <div><label className={labelClass}>Passing Year *</label><input type="number" value={edu.passingYear} onChange={(e) => handleEducationChange(edu.id, 'passingYear', e.target.value)} className={inputClass} required /></div>
                            <div>
                                <label className={labelClass}>Status *</label>
                                <select value={edu.status} onChange={(e) => handleEducationChange(edu.id, 'status', e.target.value)} className={inputClass} required>
                                    <option value="">--- Select Status ---</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Pursuing">Pursuing</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// --- Experience Details Component ---
const ExperienceDetailsForm = ({ experience, setExperience }) => {
    const defaultExperience = { organization: '', department: '', position: '', years: '', from: '', to: '' };
    
    const addExperience = () => setExperience(prev => [...prev, { ...defaultExperience, id: Date.now() }]);
    const removeExperience = (id) => setExperience(prev => prev.filter(e => e.id !== id));
    
    const handleExperienceChange = (id, name, value) => {
        setExperience(prev => prev.map(e => e.id === id ? { ...e, [name]: value } : e));
    };

    return (
        <div className={cardClass}>
            <h4 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                <FiBriefcase className="mr-2" /> Experience Details
                <motion.button type="button" onClick={addExperience} className="ml-4 p-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center" whileTap={{ scale: 0.95 }}>
                    <FiPlus className="mr-1" size={12}/> Add Experience
                </motion.button>
            </h4>
            
            <AnimatePresence initial={false}>
                {experience.map((exp, index) => (
                    <motion.div 
                        key={exp.id}
                        className="p-3 mb-3 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">Experience {index + 1}</p>
                            <motion.button type="button" onClick={() => removeExperience(exp.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full" whileTap={{ scale: 0.9 }}>
                                <FiTrash2 size={14} />
                            </motion.button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                            <div><label className={labelClass}>Organization *</label><input type="text" value={exp.organization} onChange={(e) => handleExperienceChange(exp.id, 'organization', e.target.value)} className={inputClass} required /></div>
                            <div><label className={labelClass}>Department *</label><input type="text" value={exp.department} onChange={(e) => handleExperienceChange(exp.id, 'department', e.target.value)} className={inputClass} required /></div>
                            <div><label className={labelClass}>Position *</label><input type="text" value={exp.position} onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)} className={inputClass} required /></div>
                            <div><label className={labelClass}>Years *</label><input type="number" value={exp.years} onChange={(e) => handleExperienceChange(exp.id, 'years', e.target.value)} className={inputClass} required /></div>
                            <div><label className={labelClass}>From *</label><input type="date" value={exp.from} onChange={(e) => handleExperienceChange(exp.id, 'from', e.target.value)} className={inputClass} required /></div>
                            <div><label className={labelClass}>To *</label><input type="date" value={exp.to} onChange={(e) => handleExperienceChange(exp.id, 'to', e.target.value)} className={inputClass} required /></div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// --- Document Upload Component ---
const DocumentUploadForm = ({ documents, setDocuments }) => {
    const defaultDocument = { docName: '', docNo: '', file: null };
    
    const addDocument = () => setDocuments(prev => [...prev, { ...defaultDocument, id: Date.now() }]);
    const removeDocument = (id) => setDocuments(prev => prev.filter(d => d.id !== id));
    
    const handleDocumentChange = (id, name, value) => {
        setDocuments(prev => prev.map(d => d.id === id ? { ...d, [name]: name === 'file' ? value.files[0] : value } : d));
    };

    return (
        <div className={cardClass}>
            <h4 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                <FiPaperclip className="mr-2" /> Employee Documents
                <motion.button type="button" onClick={addDocument} className="ml-4 p-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center" whileTap={{ scale: 0.95 }}>
                    <FiPlus className="mr-1" size={12}/> Add Document
                </motion.button>
            </h4>
            
            <AnimatePresence initial={false}>
                {documents.map((doc, index) => (
                    <motion.div 
                        key={doc.id}
                        className="p-3 mb-3 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">Document {index + 1}</p>
                            <motion.button type="button" onClick={() => removeDocument(doc.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full" whileTap={{ scale: 0.9 }}>
                                <FiTrash2 size={14} />
                            </motion.button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className={labelClass}>Document Name *</label>
                                <select value={doc.docName} onChange={(e) => handleDocumentChange(doc.id, 'docName', e.target.value)} className={inputClass} required>
                                    <option value="">--- Select Document Name ---</option>
                                    <option value="Aadhaar">Aadhaar Card</option>
                                    <option value="PAN">PAN Card</option>
                                    <option value="Passport">Passport</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Document No*</label>
                                <input type="text" value={doc.docNo} onChange={(e) => handleDocumentChange(doc.id, 'docNo', e.target.value)} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Choose File</label>
                                <input type="file" onChange={(e) => handleDocumentChange(doc.id, 'file', e.target)} 
                                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-blue-300 dark:hover:file:bg-gray-600"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    // Basic Info
    department: "", designation: "", employeeType: "", joiningDate: "", senior: "",
    // Personal Info
    name: "", profilePic: null, fatherName: "", motherName: "", gender: "", dob: "", nationality: "", category: "", motherTongue: "", bloodGroup: "", maritalStatus: "",
    // Contact Info
    mobile: "", officialMobile: "", email: "", officialEmail: "", salary: "",
    // Addresses
    permanentAddress: { country: "", state: "", district: "", city: "", line1: "", line2: "" },
    correspondenceAddress: { sameAsPermanent: true, country: "", state: "", district: "", city: "", line1: "", line2: "" },
    // Auxiliary Sections State
    spouseDetails: { enabled: false, name: '', dob: '', occupation: '', qualification: '', contact: '' },
    childrenDetails: { enabled: false, list: [] },
    educationDetails: { enabled: false, list: [] },
    experienceDetails: { enabled: false, list: [] },
    documents: { enabled: false, list: [] },
  });

  // Simplified state setters for lists
  const setChildren = (updater) => setEmployee(prev => ({ ...prev, childrenDetails: { ...prev.childrenDetails, list: typeof updater === 'function' ? updater(prev.childrenDetails.list) : updater } }));
  const setEducation = (updater) => setEmployee(prev => ({ ...prev, educationDetails: { ...prev.educationDetails, list: typeof updater === 'function' ? updater(prev.educationDetails.list) : updater } }));
  const setExperience = (updater) => setEmployee(prev => ({ ...prev, experienceDetails: { ...prev.experienceDetails, list: typeof updater === 'function' ? updater(prev.experienceDetails.list) : updater } }));
  const setDocuments = (updater) => setEmployee(prev => ({ ...prev, documents: { ...prev.documents, list: typeof updater === 'function' ? updater(prev.documents.list) : updater } }));

  // Global Change Handler
  const handleChange = (e, section = null, fieldName = null) => {
    const { name, value, files, type, checked } = e.target;
    
    // For nested fields (Address or Spouse)
    if (section && fieldName) {
        setEmployee((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [fieldName]: type === "file" ? files[0] : value,
            },
        }));
        return;
    }

    // For top-level fields
    setEmployee((prev) => ({
      ...prev,
      [name]:
        type === "file"
          ? files[0]
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  // Address Logic
  const handleSameAsPermanent = (e) => {
    const same = e.target.checked;
    setEmployee((prev) => ({
      ...prev,
      correspondenceAddress: {
        ...prev.correspondenceAddress,
        sameAsPermanent: same,
        ...(same ? { ...prev.permanentAddress } : { country: "", state: "", district: "", city: "", line1: "", line2: "" }),
      },
    }));
  };

  // Toggle Logic
  const handleToggleChange = (toggleName) => {
    setEmployee(prev => ({
        ...prev,
        [toggleName]: {
            ...prev[toggleName],
            enabled: !prev[toggleName].enabled,
        },
    }));
  }

  // Submission Logic
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Employee Data:", employee);
    alert("Employee Added Successfully!");
    // In a real application, you would send 'employee' data to an API here.
  };


  return (
    <motion.div
      className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <motion.div 
            className="p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
          <h2 className="text-3xl font-extrabold mb-8 text-blue-950 dark:text-white flex items-center">
            <FiUserPlus className="mr-3 text-blue-600" /> Add New Employee
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* --- 1. Basic & Job Information --- */}
            <h3 className={sectionTitleClass}>Job Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><label className={labelClass}>Department *</label><select name="department" value={employee.department} onChange={handleChange} className={inputClass} required><option value="">--- Select Department ---</option><option value="HR">HR</option><option value="Finance">Finance</option><option value="Sales">Sales</option></select></div>
              <div><label className={labelClass}>Designation *</label><select name="designation" value={employee.designation} onChange={handleChange} disabled={!employee.department} className={inputClass} required><option value="">{employee.department ? "--- Select Designation ---" : "--- Select Department First ---"}</option>{employee.department === "HR" && (<><option value="Manager">Manager</option><option value="Executive">Executive</option></>)}{employee.department === "Finance" && (<><option value="Accountant">Accountant</option><option value="Analyst">Analyst</option></>)}</select></div>
              <div><label className={labelClass}>Employee Type *</label><select name="employeeType" value={employee.employeeType} onChange={handleChange} className={inputClass} required><option value="">--- Select Employee Type ---</option><option value="Permanent">Permanent</option><option value="Contract">Contract</option></select></div>
              <div><label className={labelClass}>Joining Date</label><input type="date" name="joiningDate" value={employee.joiningDate} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Senior (Report To)</label><select name="senior" value={employee.senior} onChange={handleChange} className={inputClass}><option value="">--- Select Senior Report ---</option><option value="Manager1">Manager1</option><option value="Manager2">Manager2</option></select></div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700" />

            {/* --- 2. Personal & Contact Information --- */}
            <h3 className={sectionTitleClass}>Personal & Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2"><label className={labelClass}>Name *</label><input type="text" name="name" value={employee.name} onChange={handleChange} placeholder="Ex: Alex Johnson" className={inputClass} required /></div>
              <div className="lg:col-span-2"><label className={labelClass}>Profile Photo</label><input type="file" name="profilePic" onChange={handleChange} accept="image/*" className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-blue-300 dark:hover:file:bg-gray-600"/></div>
              <div><label className={labelClass}>Personal Mobile *</label><input type="text" name="mobile" value={employee.mobile} onChange={handleChange} placeholder="Mobile Number" className={inputClass} required /></div>
              <div><label className={labelClass}>Official Mobile</label><input type="text" name="officialMobile" value={employee.officialMobile} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Personal Email *</label><input type="email" name="email" value={employee.email} onChange={handleChange} placeholder="Personal Email" className={inputClass} required /></div>
              <div><label className={labelClass}>Official Email</label><input type="email" name="officialEmail" value={employee.officialEmail} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>DOB</label><input type="date" name="dob" value={employee.dob} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Gender</label><select name="gender" value={employee.gender} onChange={handleChange} className={inputClass}><option value="">--- Select Gender ---</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
              <div><label className={labelClass}>Marital Status</label><select name="maritalStatus" value={employee.maritalStatus} onChange={handleChange} className={inputClass}><option value="">--- Select Status ---</option><option value="Single">Single</option><option value="Married">Married</option></select></div>
              <div><label className={labelClass}>Blood Group</label><select name="bloodGroup" value={employee.bloodGroup} onChange={handleChange} className={inputClass}><option value="">--- Select Group ---</option><option value="A+">A+</option><option value="B+">B+</option><option value="O+">O+</option><option value="AB+">AB+</option></select></div>
              <div><label className={labelClass}>Father Name</label><input type="text" name="fatherName" value={employee.fatherName} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Mother Name</label><input type="text" name="motherName" value={employee.motherName} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Nationality</label><select name="nationality" value={employee.nationality} onChange={handleChange} className={inputClass}><option value="">--- Select Nationality ---</option><option value="Indian">Indian</option><option value="Other">Other</option></select></div>
              <div><label className={labelClass}>Mother Tongue</label><input type="text" name="motherTongue" value={employee.motherTongue} onChange={handleChange} placeholder="Ex: Hindi" className={inputClass} /></div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700" />

            {/* --- 3. Address Information --- */}
            <h3 className={sectionTitleClass}>Address Information</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AddressFields address={employee.permanentAddress} sectionName="Permanent Address" handleChange={handleChange} />
                <AddressFields 
                    address={employee.correspondenceAddress} 
                    sectionName="Correspondence Address" 
                    handleChange={handleChange} 
                    isCorrespondence={true} 
                    sameAsPermanent={employee.correspondenceAddress.sameAsPermanent} 
                    handleSameAsPermanent={handleSameAsPermanent}
                />
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* --- 4. Auxiliary Sections Toggles --- */}
            <h3 className={sectionTitleClass}>Additional Details (Optional)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { name: 'spouseDetails', label: 'Spouse', Icon: FiUser },
                    { name: 'childrenDetails', label: 'Children', Icon: FiUser },
                    { name: 'educationDetails', label: 'Education', Icon: FiBookOpen },
                    { name: 'experienceDetails', label: 'Experience', Icon: FiBriefcase },
                    { name: 'documents', label: 'Documents', Icon: FiPaperclip },
                ].map(({ name, label, Icon }) => (
                    <div key={name} className="flex flex-col items-center p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 transition hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handleToggleChange(name)}>
                        <Icon className={`w-6 h-6 mb-2 transition-colors ${employee[name].enabled ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
                            Add {label} Details
                        </label>
                        <input
                            type="checkbox"
                            checked={employee[name].enabled}
                            readOnly
                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                ))}
            </div>

            {/* --- 5. Conditional Form Sections --- */}
            <AnimatePresence>
                <div className="space-y-6">
                    {employee.spouseDetails.enabled && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            <SpouseDetailsForm employee={employee} handleChange={handleChange} />
                        </motion.div>
                    )}

                    {employee.childrenDetails.enabled && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            <ChildrenDetailsForm children={employee.childrenDetails.list} setChildren={setChildren} />
                        </motion.div>
                    )}

                    {employee.educationDetails.enabled && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            <EducationDetailsForm education={employee.educationDetails.list} setEducation={setEducation} />
                        </motion.div>
                    )}
                    
                    {employee.experienceDetails.enabled && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            <ExperienceDetailsForm experience={employee.experienceDetails.list} setExperience={setExperience} />
                        </motion.div>
                    )}

                    {employee.documents.enabled && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            <DocumentUploadForm documents={employee.documents.list} setDocuments={setDocuments} />
                        </motion.div>
                    )}
                </div>
            </AnimatePresence>

            {/* --- Submit Button --- */}
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                type="submit"
                className="flex items-center px-8 py-3 text-sm font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-150 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSave className="mr-2" /> Save Employee Details
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AddEmployee;
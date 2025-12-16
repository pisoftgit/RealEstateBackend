import React, { useState } from "react";
import { FaBuilding, FaUserTie, FaClock, FaDollarSign, FaCheckCircle } from "react-icons/fa";
import { GiKey } from "react-icons/gi";

// Base styling classes
const INPUT_BASE_CLASSES =
    "w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition duration-150 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";
const LABEL_BASE_CLASSES = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
const REQUIRED_STAR = <span className="text-red-500 text-lg ml-1">*</span>;
const SECTION_HEADER_CLASSES = "text-xl font-bold mb-4 flex items-center text-blue-800 dark:text-blue-400 border-b-2 border-blue-200 dark:border-blue-700 pb-2";

const ActionButton = ({ children, type = "button", color = "primary", onClick }) => {
    const colorClasses =
        color === "primary"
            ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            : "bg-red-600 hover:bg-red-700 focus:ring-red-500";

    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-6 py-3 text-white font-semibold rounded-xl shadow-lg transition duration-200 focus:outline-none focus:ring-4 ${colorClasses} flex items-center justify-center`}
        >
            {children}
        </button>
    );
};

const AssignProperty = () => {
    // Initial Form State
    const initialFormState = {
        assignFrom: "",
        sellerType: "",
        seller: "",
        project: "",
        propertyType: "",
        propertyItem: "",
        units: "",
        commissionBased: "no",
        duration: "",
        durationUnit: "days",
        settlementPrice: "",
        advancePayment: "",
    };

    const [form, setForm] = useState(initialFormState);

    // Simple handler to update form fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'radio' ? value : value, // Simplified, as we only use radio for commissionBased
        }));
    };

    // Dummy submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Form submitted! (Implement real submission logic)");
        console.log("Form Data:", form);
    };

    const handleReset = () => {
        setForm(initialFormState);
    };

    return (
        <div className="min-h-screen font-dm p-6 sm:p-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-6xl mx-auto">
            
            {/* Page Header */}
            <div className="flex items-center justify-between pb-2 mb-2">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white flex items-center">
                     Assign Property for Sale/Rent
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 rounded-xl p-8 bg-white dark:bg-gray-800 shadow-2xl">

                <section>
                    <h2 className={SECTION_HEADER_CLASSES}>
                        Property and Source Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        <div>
                            <label className={LABEL_BASE_CLASSES}>
                                Assign From (Realtor) {REQUIRED_STAR}
                            </label>
                            <select
                                name="assignFrom"
                                value={form.assignFrom}
                                onChange={handleChange}
                                className={INPUT_BASE_CLASSES}
                                required
                            >
                                <option value="">--Select Realtor--</option>
                            </select>
                        </div>

                        <div>
                            <label className={LABEL_BASE_CLASSES}>
                                Seller Type {REQUIRED_STAR}
                            </label>
                            <select
                                name="sellerType"
                                value={form.sellerType}
                                onChange={handleChange}
                                className={INPUT_BASE_CLASSES}
                                required
                            >
                                <option value="">--Select Type--</option>
                                <option value="Individual">Individual</option>
                                <option value="Developer">Developer</option>
                                {/* Add seller type options */}
                            </select>
                        </div>

                        {/* Seller */}
                        <div>
                            <label className={LABEL_BASE_CLASSES}>
                                Seller {REQUIRED_STAR}
                            </label>
                            <select
                                name="seller"
                                value={form.seller}
                                onChange={handleChange}
                                className={INPUT_BASE_CLASSES}
                                required
                            >
                                <option value="">--Select Seller--</option>
                                {/* Add sellers */}
                            </select>
                        </div>

                        {/* Project */}
                        <div>
                            <label className={LABEL_BASE_CLASSES}>
                                Project/Location {REQUIRED_STAR}
                            </label>
                            <select
                                name="project"
                                value={form.project}
                                onChange={handleChange}
                                className={INPUT_BASE_CLASSES}
                                required
                            >
                                <option value="">--Select Project--</option>
                                {/* Add projects */}
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {/* Property Type */}
                        <div>
                            <label className={LABEL_BASE_CLASSES}>
                                Property Type {REQUIRED_STAR}
                            </label>
                            <select
                                name="propertyType"
                                value={form.propertyType}
                                onChange={handleChange}
                                className={INPUT_BASE_CLASSES}
                                required
                            >
                                <option value="">--Select Property Type--</option>
                                {/* Add property types */}
                            </select>
                        </div>

                        {/* Property Item (e.g., Tower, Block, Villa) */}
                        <div>
                            <label className={LABEL_BASE_CLASSES}>
                                Property Item {REQUIRED_STAR}
                            </label>
                            <select
                                name="propertyItem"
                                value={form.propertyItem}
                                onChange={handleChange}
                                className={INPUT_BASE_CLASSES}
                                required
                            >
                                <option value="">--Select Property Item--</option>
                                {/* Add property items */}
                            </select>
                        </div>

                        {/* Units */}
                        <div>
                            <label className={LABEL_BASE_CLASSES}>
                                Unit(s) to Assign {REQUIRED_STAR}
                            </label>
                            <select
                                name="units"
                                value={form.units}
                                onChange={handleChange}
                                className={INPUT_BASE_CLASSES}
                                required
                            >
                                <option value="">--Select Unit(s)--</option>
                                {/* Add units */}
                            </select>
                        </div>
                    </div>
                </section>

                {/* --- Section 2: Commercial Details --- */}
                <section>
                    <h2 className={SECTION_HEADER_CLASSES}>
                         Commercial Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Commission Based Radio */}
                        <fieldset className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 lg:col-span-1">
                            <legend className={LABEL_BASE_CLASSES + " !mb-2 flex items-center"}>
                                <FaCheckCircle className="mr-1 text-green-500" /> Commission Based? {REQUIRED_STAR}
                            </legend>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
                                    <input
                                        type="radio"
                                        name="commissionBased"
                                        value="yes"
                                        checked={form.commissionBased === "yes"}
                                        onChange={handleChange}
                                        required
                                        className="form-radio h-4 w-4 text-blue-600 dark:bg-gray-600 dark:border-gray-500 focus:ring-blue-500 cursor-pointer"
                                    />
                                    Yes
                                </label>

                                <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
                                    <input
                                        type="radio"
                                        name="commissionBased"
                                        value="no"
                                        checked={form.commissionBased === "no"}
                                        onChange={handleChange}
                                        className="form-radio h-4 w-4 text-blue-600 dark:bg-gray-600 dark:border-gray-500 focus:ring-blue-500 cursor-pointer"
                                    />
                                    No
                                </label>
                            </div>
                        </fieldset>

                        {/* Duration */}
                        <div className="lg:col-span-1">
                            <label className={LABEL_BASE_CLASSES}>
                                Assignment Duration {REQUIRED_STAR}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    name="duration"
                                    min="0"
                                    value={form.duration}
                                    onChange={handleChange}
                                    placeholder="Ex: 3"
                                    className={`${INPUT_BASE_CLASSES} flex-grow`}
                                    required
                                />
                                <select
                                    name="durationUnit"
                                    value={form.durationUnit}
                                    onChange={handleChange}
                                    className={`${INPUT_BASE_CLASSES} w-1/3 min-w-[100px]`}
                                >
                                    <option value="days">Days</option>
                                    <option value="weeks">Weeks</option>
                                    <option value="months">Months</option>
                                </select>
                            </div>
                        </div>

                        {/* Settlement Price */}
                        <div className="lg:col-span-1">
                            <label className={LABEL_BASE_CLASSES}>
                                Settlement Price (Final Price) {REQUIRED_STAR}
                            </label>
                            <input
                                type="number"
                                name="settlementPrice"
                                value={form.settlementPrice}
                                onChange={handleChange}
                                placeholder="e.g., 5000000"
                                className={INPUT_BASE_CLASSES}
                                required
                            />
                        </div>

                        {/* Advance Payment */}
                        <div className="lg:col-span-1">
                            <label className={LABEL_BASE_CLASSES}>
                                Advance Payment (Amount)
                            </label>
                            <input
                                type="number"
                                name="advancePayment"
                                value={form.advancePayment}
                                onChange={handleChange}
                                placeholder="e.g., 50000"
                                className={INPUT_BASE_CLASSES}
                            />
                        </div>
                    </div>
                </section>

                {/* --- Buttons --- */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                    <ActionButton
                        type="reset"
                        onClick={handleReset}
                    >
                        Reset Form
                    </ActionButton>
                    <ActionButton
                        type="submit"
                        color="primary"
                    >
                        <FaUserTie className="mr-2" /> Assign Property
                    </ActionButton>
                </div>
            </form>
        </div>
    );
};

export default AssignProperty;
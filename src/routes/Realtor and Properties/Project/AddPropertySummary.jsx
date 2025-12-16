import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSave, FiX, FiCheckSquare, FiPlus, FiTrash2, FiHome } from "react-icons/fi";
import useRealEstatePropertyTypes from "../../../hooks/propertyConfig/useRealEstatePropertyTypes ";
import useSubPropertyTypes from "../../../hooks/propertyConfig/useSubPropertyTypes";
import useTowerPropertyItems from "../../../hooks/propertyConfig/useTowerPropertyItems";
import useUnits from "../../../hooks/propertyConfig/useMeasurementUnits";
import useFlatHouseStructures from "../../../hooks/propertyConfig/useFlatHouseStructure";
import { backendUrl } from "../../../ProtectedRoutes/api";

const AddPropertySummaryDynamic = ({ project, onClose }) => {
    const [form, setForm] = useState({
        propertyType: "",
        subPropertyType: "",
    });

    const [selectedSubType, setSelectedSubType] = useState(null);

    const [breakdownRows, setBreakdownRows] = useState([]);

    // --- Hooks ---
    const { propertyTypes } = useRealEstatePropertyTypes();
    const { subPropertyTypes, fetchSubPropertyTypes } = useSubPropertyTypes();
    const { items: propertyItems } = useTowerPropertyItems();
    const { units } = useUnits();
    const { structures, loading: structuresLoading } = useFlatHouseStructures();

    // --- Fetch Sub Property Types ---
    useEffect(() => {
        if (form.propertyType) {
            fetchSubPropertyTypes(form.propertyType);
            setForm(prev => ({ ...prev, subPropertyType: "" }));
            setBreakdownRows([]);
        }
    }, [form.propertyType, fetchSubPropertyTypes]);

    // --- When subPropertyType changes, store flags ---
    useEffect(() => {
        const selected = subPropertyTypes.find(
            s => s.id === Number(form.subPropertyType)
        );
        setSelectedSubType(selected || null);
    }, [form.subPropertyType, subPropertyTypes]);

    // --- Handle form change ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // --- Add Row ---
    const addRow = () => {
        setBreakdownRows(prev => [
            ...prev,
            {
                propertyItemId: "",
                area: "",
                areaUnitId: "",
                flatHouseStructureId: "",
                noOfItems: ""
            }
        ]);
    };

    // --- Remove Row ---
    const removeRow = (index) => {
        setBreakdownRows(prev => prev.filter((_, i) => i !== index));
    };

    // --- Update Row ---
    const handleRowChange = (index, field, value) => {
        const updated = [...breakdownRows];
        updated[index][field] = value;
        setBreakdownRows(updated);
    };

    // --- Submit Form ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            projectId: project.id,
            subPropertyTypeId: Number(form.subPropertyType),
            metaRows: breakdownRows.map(row => ({
                propertyItemId: row.propertyItemId ? Number(row.propertyItemId) : null,
                area: Number(row.area),
                areaUnitId: Number(row.areaUnitId),
                flatHouseStructureId: row.flatHouseStructureId
                    ? Number(row.flatHouseStructureId)
                    : null,
                noOfItems: Number(row.noOfItems),
            })),
        };

        try {
            const token = localStorage.getItem("authToken");
            await axios.post(`${backendUrl}/real-estate-properties/summary`,
                payload,
                { headers: { "Content-Type": "application/json", secret_key: token } }
            );

            alert("Property summary saved!");
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save summary");
        }
    };

    // --- Conditional Rendering Logic ---
    const showPropertyItem =
        selectedSubType?.isResidential && selectedSubType?.isMultiTower;

    const showStructure =
        (selectedSubType?.isResidential && selectedSubType?.isMultiTower) ||
        (selectedSubType?.isResidential && selectedSubType?.isHouseVilla);

    const modalClasses =
        "fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-[100] p-4 overflow-y-auto"; // z-[100] for maximum certainty, items-start for top alignment, overflow-y-auto for modal background scroll

    const cardClasses =
        "w-auto max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl mt-10 mb-10 overflow-hidden"; // max-w-5xl is good, mt-10/mb-10 gives breathing room

    const inputClasses =
        "w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-600"; // Changed bg-gray-50 to bg-white for better contrast

    const labelClasses = "block font-medium mb-2 text-gray-700 dark:text-gray-300";

    return (
        <div className={modalClasses}>
            <div className={cardClasses}>
                {/* Header (Fixed within the Card) */}
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white dark:bg-gray-800 z-10 rounded-t-xl">
                    <h1 className="text-2xl font-semibold flex items-center">
                        <FiHome className="mr-3 text-blue-600" /> Add Property Summary for {project.name || "Project"}
                    </h1>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        aria-label="Close modal"
                    >
                        <FiX size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Property Type Selection */}
                    <div className="grid md:grid-cols-2 gap-6 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div>
                            <label className={labelClasses}>Property Type *</label>
                            <select
                                name="propertyType"
                                value={form.propertyType}
                                onChange={handleChange}
                                className={inputClasses}
                                required
                            >
                                <option value="">Select</option>
                                {propertyTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClasses}>Sub Property Type *</label>
                            <select
                                name="subPropertyType"
                                value={form.subPropertyType}
                                onChange={handleChange}
                                className={inputClasses}
                                required
                                disabled={!form.propertyType}
                            >
                                <option value="">Select</option>

                                {subPropertyTypes
                                    .filter(s => s.realEstatePropertyType?.id === Number(form.propertyType))
                                    .map(sub => (
                                        <option key={sub.id} value={sub.id}>
                                            {sub.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    {/* Breakdown Section */}
                    {selectedSubType && (
                        <div className="p-6 border rounded-lg bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
                                <FiCheckSquare className="mr-2 text-blue-600" /> Breakdown Details
                            </h2>

                            {/* Breakdown Rows */}
                            <div className="space-y-4">
                                {breakdownRows.map((row, index) => (
                                    <div key={index} className="grid md:grid-cols-6 gap-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 items-end">
                                        
                                        {/* Property Item (MultiTower Residential Only) */}
                                        {showPropertyItem && (
                                            <div>
                                                <label className={labelClasses}>Property Item *</label>
                                                <select
                                                    value={row.propertyItemId}
                                                    onChange={(e) =>
                                                        handleRowChange(index, "propertyItemId", e.target.value)
                                                    }
                                                    className={inputClasses}
                                                    required
                                                >
                                                    <option value="">Select Item</option>
                                                    {propertyItems.map(item => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {/* AREA */}
                                        <div>
                                            <label className={labelClasses}>Area *</label>
                                            <input
                                                type="number"
                                                value={row.area}
                                                onChange={(e) =>
                                                    handleRowChange(index, "area", e.target.value)
                                                }
                                                className={inputClasses}
                                                required
                                            />
                                        </div>

                                        {/* UNIT */}
                                        <div>
                                            <label className={labelClasses}>Unit *</label>
                                            <select
                                                value={row.areaUnitId}
                                                onChange={(e) =>
                                                    handleRowChange(index, "areaUnitId", e.target.value)
                                                }
                                                className={inputClasses}
                                                required
                                            >
                                                <option value="">Select Unit</option>
                                                {units.map(unit => (
                                                    <option key={unit.id} value={unit.id}>
                                                        {unit.unitName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Structure (MultiTower + HouseVilla) */}
                                        {showStructure && (
                                            <div>
                                                <label className={labelClasses}>Structure *</label>
                                                <select
                                                    value={row.flatHouseStructureId}
                                                    onChange={(e) =>
                                                        handleRowChange(index, "flatHouseStructureId", e.target.value)
                                                    }
                                                    className={inputClasses}
                                                    disabled={structuresLoading}
                                                    required
                                                >
                                                    <option value="">Select Structure</option>
                                                    {structures.map(s => (
                                                        <option key={s.id} value={s.id}>
                                                            {`${s.structureName} ${s.flatHouseStructureType.structureType}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {/* QUANTITY */}
                                        <div>
                                            <label className={labelClasses}>Quantity *</label>
                                            <input
                                                type="number"
                                                value={row.noOfItems}
                                                onChange={(e) =>
                                                    handleRowChange(index, "noOfItems", e.target.value)
                                                }
                                                className={inputClasses}
                                                required
                                            />
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            onClick={() => removeRow(index)}
                                            className="bg-red-600 text-white h-full px-3 py-3 rounded-lg flex items-center justify-center hover:bg-red-700 transition"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))}
                            </div>


                            <button
                                type="button"
                                onClick={addRow}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <FiPlus /> Add Row
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-300 dark:bg-gray-600 dark:text-white rounded-lg flex items-center gap-2 hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                        >
                            <FiX /> Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-900 text-white rounded-lg flex items-center gap-2 hover:bg-blue-800 transition"
                        >
                            <FiSave /> Save Summary
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPropertySummaryDynamic;
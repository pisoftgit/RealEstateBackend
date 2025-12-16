import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  FaBuilding,
  FaPlus,
  FaMinus,
  FaSave,
  FaEdit,
  FaTrashAlt,
  FaTrash,
} from "react-icons/fa";
import { BsLayersFill } from "react-icons/bs";

import { backendUrl } from "../../../../ProtectedRoutes/api";
import "react-toastify/dist/ReactToastify.css";

const PRIMARY_COLOR_CLASSES = "bg-blue-950 hover:bg-blue-800 text-white";
const ACCENT_TEXT_COLOR = "text-blue-950 dark:text-blue-400";
const BUTTON_BASE_CLASSES =
  "px-3 py-2 rounded-lg font-semibold transition duration-200 shadow-md flex items-center justify-center text-sm";
const INPUT_BASE_CLASSES =
  "w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-3 transition duration-150 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100";


const ActionButton = ({ children, color = "default", onClick, className = "", disabled = false }) => {
    const colorClasses =
        color === "primary"
            ? PRIMARY_COLOR_CLASSES
            : color === "danger"
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600";

    return (
        <button
            onClick={onClick}
            className={`${BUTTON_BASE_CLASSES} ${colorClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

const initialUnitDefinition = {
    structure: "",
    area: "",
    quantity: 1, 
    totalLinkableUnit: 0, 
};

export default function UpdateTower() {
    const location = useLocation();
    const navigate = useNavigate();

    const secret_key = localStorage.getItem("authToken");
    const params = new URLSearchParams(location.search);
    const towerId = params.get("towerId");

    const [tower, setTower] = useState(null);
    const [loading, setLoading] = useState(true);

    const [subProperties, setSubProperties] = useState([]);
    const [floors, setFloors] = useState([]); 
    const [floorUnits, setFloorUnits] = useState([]);
    
    const [selectedPropertyId, setSelectedPropertyId] = useState("");
    const [selectedFloorId, setSelectedFloorId] = useState("");
    const [selectedUnitId, setSelectedUnitId] = useState("");
    
    const [unitDefinitions, setUnitDefinitions] = useState([initialUnitDefinition]);

    const selectedSubProperty = subProperties.find(p => p.id === selectedPropertyId) || {};
    const showQuantityInput = selectedSubProperty.isFlat === true && selectedSubProperty.isSingleFloor === true;
    
    // -------------------- Data Fetching --------------------

    useEffect(() => {
        if (!towerId) {
            toast.error("Tower ID missing in URL");
            setLoading(false);
            return;
        }

        const fetchTowerAndFloors = async () => {
            try {
                const towerRes = await axios.get(
                    `${backendUrl}/real-estate-properties/getTowerDetailsByTowerId/${towerId}`,
                    { headers: { secret_key } }
                );
                setTower(towerRes.data);

                const floorRes = await axios.get(
                    `${backendUrl}/floor/getTowerFloors/${towerId}`,
                    { headers: { secret_key } }
                );
                
                const floorsData = floorRes.data || [];
                const sortedFloors = floorsData
                    .map(f => ({ id: f.id, floorNumber: f.floorNumber, flats: f.flats || [] }))
                    .sort((a, b) => a.floorNumber - b.floorNumber);

                setFloors(sortedFloors);

            } catch (err) {
                toast.error("Failed to load tower or floor details.");
                setLoading(false);
            }
        };

        fetchTowerAndFloors();
    }, [towerId, secret_key]);


    useEffect(() => {
        const fetchProperties = async () => {
            if (!towerId) return;

            try {
                const res = await axios.get(
                    `${backendUrl}/floor/getSubPropertyTypesByTowerId/${towerId}`,
                    { headers: { secret_key } }
                );
                
                const propertiesData = res.data || [];
                setSubProperties(propertiesData); 
                
                if (propertiesData.length > 0) {
                    setSelectedPropertyId(propertiesData[0].id);
                }
            } catch (err) {
                toast.error("Failed to load sub-property types from API.");
                setSubProperties([]);
            }
        };
        fetchProperties();
    }, [towerId, secret_key]);
    
    
    useEffect(() => {
        const fetchFloorUnits = async () => {
            if (!selectedFloorId) {
                setFloorUnits([]);
                return;
            }
            
            try {
                const res = await axios.get(
                    `${backendUrl}/floor/getSingleFloorItems`,
                    { headers: { secret_key } }
                );
                
                setFloorUnits(res.data || []);
            } catch (err) {
                toast.error("Failed to load units for the selected floor.");
                setFloorUnits([]);
            }
        };

        setSelectedUnitId(""); 
        fetchFloorUnits();
        
    }, [selectedFloorId, secret_key]); 


    useEffect(() => {
        if (tower !== null && subProperties.length >= 0) {
            setLoading(false);
        }
    }, [tower, subProperties]);

    // -------------------- Unit Management Logic --------------------

    const handleAddUnitDefinition = () => {
        setUnitDefinitions(prev => [...prev, initialUnitDefinition]);
    };

    const handleRemoveUnitDefinition = (index) => {
        if (unitDefinitions.length > 1) {
            setUnitDefinitions(prev => prev.filter((_, i) => i !== index));
        } else {
            setUnitDefinitions([initialUnitDefinition]);
            toast.info("Cleared the last unit definition row.");
        }
    };

    const handleUnitChange = (index, field, value) => {
        setUnitDefinitions(prev => 
            prev.map((unit, i) => 
                i === index ? { ...unit, [field]: value } : unit
            )
        );
    };
    
    const handleUnitIncrement = (index) => {
        setUnitDefinitions(prev => 
            prev.map((unit, i) => 
                i === index && unit.quantity < 1000 ? { ...unit, quantity: unit.quantity + 1 } : unit
            )
        );
    };

    const handleUnitDecrement = (index) => {
        setUnitDefinitions(prev => 
            prev.map((unit, i) => 
                i === index && unit.quantity > 1 ? { ...unit, quantity: unit.quantity - 1 } : unit
            )
        );
    };


    // -------------------- Form Submission --------------------

    const handleCreateUnits = async (unitDef, index) => {
        if (!selectedFloorId || !selectedPropertyId || !unitDef.structure || !unitDef.area) {
            toast.error("Please select Property Type, Floor, and fill all required Unit fields.");
            return;
        }

        const quantity = showQuantityInput ? unitDef.quantity : 1;

        try {
            await axios.post(
                `${backendUrl}/floor/addUnit`,
                { 
                    towerId, 
                    floorId: selectedFloorId, 
                    subPropertyId: selectedPropertyId,
                    structure: unitDef.structure, 
                    area: unitDef.area,          
                    quantity: quantity 
                },
                { headers: { secret_key } }
            );
            
            const floorNumber = floors.find(f => f.id === selectedFloorId)?.floorNumber;
            toast.success(`${quantity} Unit(s) of ${unitDef.structure} created successfully for Floor ${floorNumber}!`);
            
            setUnitDefinitions(prev => 
                prev.map((unit, i) => 
                    i === index ? initialUnitDefinition : unit
                )
            );

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create units. Check backend logs.");
        }
    };


    // -------------------- Placeholder Handlers --------------------

    const handleActionClick = (action) => {
        if (action === 'addUnit') {
            document.getElementById("unit-creation-card")?.scrollIntoView({ behavior: 'smooth' });
            toast.info("Ready to define new unit types.");
        } else {
            toast.info(`${action} logic triggered.`);
        }
    };

    // -------------------- Render Logic --------------------

    if (loading) {
        return (
            <div className="p-10 text-center text-xl font-medium dark:text-gray-200">
                <FaBuilding className="inline mr-2 animate-pulse text-blue-500" /> Loading tower configuration...
            </div>
        );
    }

    if (!tower) {
        return (
            <div className="p-10 text-center text-red-600 font-semibold dark:text-red-400">
                Tower not found or failed to load. Please check the Tower ID.
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            
            <div className="max-w-6xl mx-auto">
                {/* --- HEADER & TOWER INFO --- */}
                <div className="border-b pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white flex items-center mb-4 sm:mb-0">
                        <FaBuilding className={`mr-3 ${ACCENT_TEXT_COLOR}`} /> Manage Tower Units
                    </h1>
                    <div className={`text-xl font-bold ${ACCENT_TEXT_COLOR} bg-blue-100 dark:bg-blue-900 p-2 rounded-lg shadow-sm`}>
                        {tower.blockHouseName}
                    </div>
                </div>

                {/* --- ACTION BUTTONS GROUP --- */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <ActionButton color="primary" onClick={() => handleActionClick('addUnit')}>
                        <FaPlus className="mr-2" /> Add Unit Definitions
                    </ActionButton>
                    <ActionButton onClick={() => handleActionClick('addFloor')}>
                        <FaPlus className="mr-2" /> Add Floor
                    </ActionButton>
                    <ActionButton onClick={() => handleActionClick('updateFloor')}>
                        <FaEdit className="mr-2" /> Update Floor
                    </ActionButton>
                    <ActionButton color="danger" onClick={() => handleActionClick('deleteFloor')}>
                        <FaTrashAlt className="mr-2" /> Delete Floor
                    </ActionButton>
                </div>

                {/* --- Main Content: Unit Creation Card --- */}
                <div
                    id="unit-creation-card"
                    className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-900 rounded-xl shadow-2xl p-8 mb-8"
                >
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center">
                        <BsLayersFill className={`mr-3 text-blue-600`} /> Define & Link Units to Floor
                    </h2>

                    {/* --- Selection Dropdowns: Property & Floor --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b dark:border-gray-700 pb-6">
                        {/* Property Select */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400" htmlFor="property-select">
                                Property Type (Property) <span className="text-red-600">*</span>
                            </label>
                            <select
                                id="property-select"
                                className={INPUT_BASE_CLASSES}
                                value={selectedPropertyId}
                                onChange={(e) => setSelectedPropertyId(e.target.value)}
                                required
                            >
                                <option value="">--- Select Property Type ---</option>
                                {subProperties.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Rule: {selectedSubProperty.isFlat === true && selectedSubProperty.isSingleFloor === true ? 
                                    <span className="text-green-600">Quantity input shown (Flat & Single Floor)</span> : 
                                    <span className="text-orange-600">Quantity input hidden (Not Flat or Multi-Floor)</span>}
                            </p>
                            {subProperties.length === 0 && !loading && (
                                <p className="text-sm text-red-500">No Property Types found for this Tower.</p>
                            )}
                        </div>

                        {/* Floor Select */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400" htmlFor="floor-select">
                                Floor <span className="text-red-600">*</span>
                            </label>
                            <select
                                id="floor-select"
                                className={INPUT_BASE_CLASSES}
                                value={selectedFloorId}
                                onChange={(e) => setSelectedFloorId(e.target.value)}
                                required
                                disabled={!selectedPropertyId || floors.length === 0}
                            >
                                <option value="">--- Choose Floor ---</option>
                                {floors.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        Floor {f.floorNumber}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Floor Unit Select (For existing unit update/link) */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400" htmlFor="floor-unit-select">
                                Existing Floor Unit (Optional)
                            </label>
                            <select
                                id="floor-unit-select"
                                className={INPUT_BASE_CLASSES}
                                value={selectedUnitId}
                                onChange={(e) => setSelectedUnitId(e.target.value)}
                                disabled={!selectedFloorId || floorUnits.length === 0}
                            >
                                <option value="">--- Select Unit for Linking/Update ---</option>
                                {floorUnits.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} 
                                    </option>
                                ))}
                            </select>
                            {selectedFloorId && floorUnits.length === 0 && (
                                <p className="text-xs text-orange-600">No units found on this floor. Create one below.</p>
                            )}
                        </div>
                    </div>

                    {/* --- Dynamic Unit Definition Rows (For NEW Unit Creation) --- */}
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-200 mb-4 flex items-center justify-between">
                        New Unit Type Definition(s)
                        <ActionButton 
                            onClick={handleAddUnitDefinition} 
                            color="primary" 
                            className="py-1 px-3 text-sm"
                            title="Add another unit type definition row"
                        >
                            <FaPlus className="mr-1" /> Add Row
                        </ActionButton>
                    </p>

                    {unitDefinitions.map((unitDef, index) => (
                        <div key={index} className="mt-4 p-5 bg-blue-50 dark:bg-gray-900 rounded-lg border border-blue-300 dark:border-blue-700 mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold text-gray-700 dark:text-gray-200">
                                    Unit Definition #{index + 1}
                                </span>
                                {(unitDefinitions.length > 1 || (unitDefinitions.length === 1 && (unitDef.structure || unitDef.area))) && (
                                    <button
                                        type="button"
                                        className="text-red-600 hover:text-red-800 transition"
                                        onClick={() => handleRemoveUnitDefinition(index)}
                                        title={unitDefinitions.length > 1 ? "Remove this unit type definition" : "Clear fields"}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>

                            <div className={`grid grid-cols-1 sm:grid-cols-2 ${showQuantityInput ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 items-end`}>
                                {/* Structure */}
                                <div className="space-y-2">
                                    <label htmlFor={`structure-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Structure (Unit) <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        id={`structure-${index}`}
                                        className={INPUT_BASE_CLASSES}
                                        value={unitDef.structure}
                                        onChange={(e) => handleUnitChange(index, 'structure', e.target.value)}
                                        required
                                    >
                                        <option value="">--Choose Structure--</option>
                                        <option value="1 BHK">1 BHK</option>
                                        <option value="2 BHK">2 BHK</option>
                                        <option value="3 BHK">3 BHK</option>
                                    </select>
                                </div>

                                {/* Area */}
                                <div className="space-y-2">
                                    <label htmlFor={`area-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Area (sq ft) <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        id={`area-${index}`}
                                        className={INPUT_BASE_CLASSES}
                                        value={unitDef.area}
                                        onChange={(e) => handleUnitChange(index, 'area', e.target.value)}
                                        required
                                    >
                                        <option value="">- Select Area -</option>
                                        <option value="800">800</option>
                                        <option value="950">950</option>
                                        <option value="1100">1100</option>
                                    </select>
                                </div>

                                {/* Quantity Input - Dynamic based on SubProperty */}
                                {showQuantityInput && (
                                    <div className="space-y-2">
                                        <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            Quantity <span className="text-red-600">*</span>
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                className="p-2 border border-gray-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
                                                onClick={() => handleUnitDecrement(index)}
                                                disabled={unitDef.quantity <= 1}
                                            >
                                                <FaMinus className="w-4 h-4" />
                                            </button>
                                            <input
                                                id={`quantity-${index}`}
                                                type="number"
                                                className={`${INPUT_BASE_CLASSES} text-center p-2`}
                                                value={unitDef.quantity}
                                                onChange={(e) => handleUnitChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                                min="1"
                                                max="1000"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className={`p-2 rounded-lg border border-blue-950 ${PRIMARY_COLOR_CLASSES} hover:ring-2 hover:ring-blue-300`}
                                                onClick={() => handleUnitIncrement(index)}
                                            >
                                                <FaPlus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Total Linkable Units (Read-only/Placeholder) */}
                                <div className="space-y-2">
                                    <label htmlFor={`linkable-unit-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Total Linkable Units
                                    </label>
                                    <input
                                        id={`linkable-unit-${index}`}
                                        type="text"
                                        className={`${INPUT_BASE_CLASSES} bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-500`}
                                        value={unitDef.totalLinkableUnit > 0 ? `${unitDef.totalLinkableUnit} units` : 'N/A'}
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Create Unit Button for the current row */}
                            <div className="flex justify-end mt-6 pt-4 border-t dark:border-gray-700">
                                <ActionButton
                                    color="primary"
                                    className="py-2 px-6"
                                    onClick={() => handleCreateUnits(unitDef, index)}
                                    disabled={!selectedFloorId || !selectedPropertyId || !unitDef.structure || !unitDef.area || (showQuantityInput && unitDef.quantity < 1)}
                                >
                                    <FaSave className="mr-3" /> 
                                    Create {showQuantityInput ? unitDef.quantity : 1} Unit(s)
                                </ActionButton>
                            </div>
                        </div>
                    ))}

                </div>

                {/* --- MAIN SAVE TOWER CONFIGURATION BUTTON --- */}
                <div className="flex justify-end pt-4">
                    <ActionButton
                        color="primary"
                        className="text-lg py-3 px-8"
                        onClick={() => toast.info("Main 'Submit' (Save Tower Changes) action triggered!")}
                    >
                        <FaSave className="mr-2" /> Save Tower Configuration
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}
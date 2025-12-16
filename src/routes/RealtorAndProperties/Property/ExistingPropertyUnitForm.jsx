import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ArrowLeft, HardHat, ListPlus, Loader2, AlertTriangle, Save } from "lucide-react";
import { ToastContainer, Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { backendUrl } from "../../../ProtectedRoutes/api";

const ExistingPropertyUnitForm = ({ projectId, subPropertyTypeId, handleBack }) => {
    const secretKey = localStorage.getItem("authToken");

    // --- TOWER SELECTION STATE ---
    const [existingBlocks, setExistingBlocks] = useState([]);
    const [selectedBlockId, setSelectedBlockId] = useState("");
    const [blockDetails, setBlockDetails] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // --- SERIALIZATION STATE ---
    const [units, setUnits] = useState([]);
    const [bulkFrom, setBulkFrom] = useState("");
    const [bulkTo, setBulkTo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    // CRITICAL: The submission payload needs the ID key to be 'id' at the root.
    const towerStructureIdKey = 'id'; 


    // Fetches the list of blocks/towers for the project
    const fetchExistingBlocks = useCallback(async () => {
        if (!projectId) return;

        setSelectedBlockId("");
        setBlockDetails(null);
        setUnits([]); // Reset units when changing block
        setExistingBlocks([]);
        
        try {
            setIsLoading(true);
            setError(null);
            
            const res = await axios.get(
                `${backendUrl}/real-estate-properties/getAllSocietyBlocksByProjectId/${projectId}`, 
                { 
                    headers: { secret_key: secretKey }
                }
            );
            
            // Assuming getAllSocietyBlocksByProjectId returns a list of blocks with 'id' and 'blockHouseName'
            const data = (res.data?.data || res.data || []).map(block => ({
                id: block.id,
                name: block.blockHouseName,
            }));
            
            setExistingBlocks(data);
            
            if (data.length === 0) {
                toast.info("No existing blocks found for this project.");
            }

        } catch (err) {
            console.error("Fetch Existing Blocks Error:", err);
            setError("Failed to fetch existing blocks/towers.");
            toast.error("Failed to fetch existing blocks/towers.");
        } finally {
            setIsLoading(false);
        }
    }, [projectId, secretKey]);
    
    // --- UPDATED to match the response structure ---
    const initializeUnitState = (details) => {
        // The floors array is directly at the root
        const floors = details?.floors || [];

        if (floors.length === 0) {
            toast.warn("The selected block has no floors/units defined.");
            setUnits([]);
            return;
        }
        
        // Map the structure, using flatId as the unit identifier and areaUnit
        setUnits(
            floors.map(f => ({
                // Keep floor level IDs and info if needed for the submission, 
                // but only include necessary data for state:
                id: f.id, 
                floorNumber: f.floorNumber,
                flats: f.flats.map(flat => ({
                    // CRITICAL: Use flatId as the primary unique ID for the flat
                    id: flat.flatId, 
                    area: flat.area,
                    areaUnit: flat.areaUnit, // Use areaUnit string
                    // Use existing flatNumber if present, otherwise default to empty string
                    flatNumber: flat.flatNumber || "" 
                }))
            }))
        );
    };

    // Fetches the detailed floor/unit structure for the selected block
    const fetchBlockDetails = useCallback(async (blockId) => {
        if (!blockId) return;

        const selectedBlock = existingBlocks.find(b => String(b.id) === String(blockId));
        if (!selectedBlock) return;

        setBlockDetails(null);
        setUnits([]);

        try {
            setIsLoading(true);
            setError(null);
        
            // API endpoint to get tower structure details
            const detailsRes = await axios.get(
                `${backendUrl}/real-estate-properties/getTowerDetailsByTowerId/${blockId}`, 
                {
                    headers: { 
                        "Content-Type": "application/json",
                        secret_key: secretKey 
                    },
                }
            );
            
            // Assuming response is directly the structure object (like the JSON provided)
            const details = detailsRes.data; 
            setBlockDetails(details); 
            
            // Initialize state with fetched details
            initializeUnitState(details);
            
            toast.success(`Structure fetched for Block: ${selectedBlock.name}`);

        } catch (err) {
            console.error("Fetch Block Details Error:", err);
            setError("Failed to fetch detailed block structure.");
            toast.error("Failed to fetch detailed block structure.");
        } finally {
            setIsLoading(false);
        }
    }, [existingBlocks, secretKey]);

    useEffect(() => {
        fetchExistingBlocks();
    }, [fetchExistingBlocks]);

    const handleBlockSelection = (e) => {
        const id = e.target.value;
        setSelectedBlockId(id);
        if (id) {
            fetchBlockDetails(id);
        } else {
            setBlockDetails(null);
            setUnits([]);
        }
    };
    
    const selectedBlock = existingBlocks.find(b => String(b.id) === String(selectedBlockId));

    const handleNumberChange = (floorIndex, flatIndex, value) => {
        setUnits(prev => {
            const updated = [...prev];
            updated[floorIndex].flats[flatIndex].flatNumber = value;
            return updated;
        });
    };

    const handleBulkFill = () => {
        const start = Number(bulkFrom);
        const end = Number(bulkTo);

        if (!start || !end || start > end || start < 1 || !units.length) {
            toast.error("Invalid range or no units loaded.");
            return;
        }

        let current = start;

        setUnits(prev =>
            prev.map(floor => ({
                ...floor,
                flats: floor.flats.map(flat => {
                    // Only fill if the current number is within the range
                    if (current <= end) {
                        const updated = { ...flat, flatNumber: String(current) };
                        current++;
                        return updated;
                    }
                    return flat;
                })
            }))
        );
        toast.info(`Units filled from ${start} to ${end}.`);
        setBulkFrom("");
        setBulkTo("");
    };

    // Handler to reset state upon successful completion
    const handleAssignmentComplete = () => {
        setSelectedBlockId("");
        setBlockDetails(null);
        setUnits([]);
        fetchExistingBlocks(); // Re-fetch block list to show updated status/reset view
    };


    const handleSubmit = async () => {
        if (isSubmitting) return;

        // 1. Validation and ID Check
        if (!selectedBlockId || !blockDetails || !blockDetails[towerStructureIdKey]) {
            toast.error("Structure ID or block details are missing. Cannot submit.");
            return;
        }

        // Use the 'id' from the fetched block details as the primary structure ID
        const towerStructureId = blockDetails[towerStructureIdKey]; 
        const allUnits = units.flatMap(floor => floor.flats);
        const hasEmptyFlatNumber = allUnits.some(flat => !flat.flatNumber.trim());

        if (hasEmptyFlatNumber) {
            toast.error("Please assign a number to all units before saving.");
            return;
        }
        
        // 2. Prepare Payload (Recreating the exact structure expected by the backend)
        const payload = {
            // CRITICAL: Send the root ID (id: 364944) back
            [towerStructureIdKey]: Number(towerStructureId), 
            projectId: Number(projectId),
            subPropertyTypeId: Number(subPropertyTypeId),
            blockHouseName: blockDetails.blockHouseName, // Include block name if the API expects it

            floors: units.map(floor => ({
                id: floor.id, // Include floor ID if available
                floorNumber: floor.floorNumber,
                flats: floor.flats.map(flat => ({
                    // CRITICAL: The flat ID needs to be sent back as 'flatId' or 'id'
                    // We map the unit state 'id' back to 'flatId' for the payload
                    flatId: flat.id, 
                    area: flat.area,
                    areaUnit: flat.areaUnit, // Send the area unit string back
                    flatNumber: flat.flatNumber.trim(), 
                    // Add other expected fields if necessary (like structureType, structureName etc.)
                    // For safety, we keep the payload concise with only essential update fields.
                }))
            })),
        };
        
        const apiUrl = `${backendUrl}/real-estate-properties/updateTowerDetails`; 

        // 3. API Call
        try {
            setIsSubmitting(true);

            await axios.put(
                apiUrl,
                payload,
                { headers: { secret_key: secretKey } }
            );

            toast.success(`Units saved successfully for ${selectedBlock.name}!`);
            handleAssignmentComplete();

        } catch (err) {
            console.error("Submission Error:", err);
            toast.error(`Failed to save unit numbers: ${err.response?.data?.message || 'Server error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };


    // ------------------------------------
    // 4. RENDER
    // ------------------------------------

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-inner border border-green-300 dark:border-green-600">
            <button 
                onClick={handleBack} 
                className="mb-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 flex items-center gap-1 font-medium"
            >
                <ArrowLeft className="h-4 w-4"/> Back to Unit Creation
            </button>
            <h2 className="text-xl font-bold mb-4 text-green-700 dark:text-green-300 flex items-center gap-2">
                <HardHat className="h-6 w-6"/> Select Existing Block/Tower
            </h2>
            
            {/* Error and Loading Handlers */}
            {error && (
                <div className="p-3 mb-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5"/> Error: {error}
                </div>
            )}

            {isLoading && (
                <div className="text-center p-4">
                    <Loader2 className="h-6 w-6 inline animate-spin mr-2 text-blue-600" />
                    Loading data...
                </div>
            )}
            
            {/* Block Selection Dropdown */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Select Block/Tower Structure *
                    </label>
                    <select
                        value={selectedBlockId}
                        onChange={handleBlockSelection}
                        disabled={existingBlocks.length === 0 || isLoading}
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="">
                            {existingBlocks.length > 0 ? "Choose an Existing Block/Tower" : "No Blocks Found"}
                        </option>
                        {existingBlocks.map((block) => (
                            <option key={block.id} value={block.id}>
                                {block.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                {selectedBlock && (
                    <div className="p-3 bg-green-50 dark:bg-gray-700 rounded border border-green-200 dark:border-green-500 self-center">
                        <p className="text-sm font-medium">Selected Block: <span className="font-bold">{selectedBlock.name}</span></p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">ID: {selectedBlock.id}</p>
                    </div>
                )}
            </div>

            {/* Step 2: Unit Assignment Form (Rendered after block details are fetched) */}
            {selectedBlock && blockDetails && units.length > 0 && !isLoading && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-200 flex items-center gap-2">
                        <ListPlus className="h-5 w-5"/> Assign Units to {selectedBlock.name}
                    </h3>
                    
                    {/* Bulk Fill Section */}
                    <div className="flex flex-wrap gap-4 items-center mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[100px]">Bulk Fill Range:</span>
                        <input
                            type="number"
                            className="border px-3 py-2 rounded w-24 text-center dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            placeholder="From"
                            value={bulkFrom}
                            onChange={(e) => setBulkFrom(e.target.value)}
                        />

                        <input
                            type="number"
                            className="border px-3 py-2 rounded w-24 text-center dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            placeholder="To"
                            value={bulkTo}
                            onChange={(e) => setBulkTo(e.target.value)}
                        />

                        <button
                            onClick={handleBulkFill}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            Fill
                        </button>
                    </div>

                    {/* Floor and Flat Input Fields */}
                    {units.map((floor, fIdx) => (
                        <div className="border rounded-xl p-6 mb-6 bg-white dark:bg-gray-800 shadow-md" key={fIdx}>
                            <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
                                <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">Floor - {floor.floorNumber}</span>
                            </h2>

                            <div className="flex flex-wrap gap-4 justify-center">
                                {floor.flats.map((flat, index) => (
                                    <div
                                        key={flat.id}
                                        className="border rounded-lg p-4 w-60 bg-gray-50 dark:bg-gray-700 shadow-sm"
                                    >
                                        <div className="font-semibold text-center text-gray-800 dark:text-gray-200">
                                            Unit Size: {flat.area} {flat.areaUnit}
                                        </div>

                                        <input
                                            type="text"
                                            className="border w-full px-2 py-1 mt-2 rounded text-center font-mono text-lg bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-green-500 focus:border-green-500"
                                            placeholder="Flat Number"
                                            value={flat.flatNumber}
                                            onChange={(e) =>
                                                handleNumberChange(fIdx, index, e.target.value)
                                            }
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Submit Button */}
                    <div className="text-center mt-8">
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-200 disabled:opacity-50 flex items-center justify-center mx-auto"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Saving Units...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5 mr-2" />
                                    Save Serialized Units
                                </>
                            )}
                        </button>
                    </div>

                </div>
            )}
            
            {!selectedBlock && !isLoading && existingBlocks.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-600 rounded">
                    Please select an existing block from the dropdown to load its structure and assign unit numbers.
                </div>
            )}

            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Bounce}
            />
        </div>
    );
};

export default ExistingPropertyUnitForm;
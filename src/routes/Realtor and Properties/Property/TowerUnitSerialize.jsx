import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ListChecks, Save, Loader2 } from "lucide-react";
import { backendUrl } from "../../../ProtectedRoutes/api";

const TowerUnitSerializer = ({ towerData, onComplete }) => {
    const secretKey = localStorage.getItem("authToken")

    const floors = towerData?.tower?.floors || [];

    const [units, setUnits] = useState(() => {
        return floors.map(f => ({
            floorNumber: f.floorNumber,
            flats: f.flats.map(flat => ({
                id: flat.id,
                area: flat.area,
                areaUnitId: flat.areaUnitId,
                flatNumber: flat.flatNumber || "" 
            }))
        }));
    });
    const [bulkFrom, setBulkFrom] = useState("");
    const [bulkTo, setBulkTo] = useState("");
    
    // State for submission handling
    const [isSubmitting, setIsSubmitting] = useState(false);


    // --- Handlers ---

    const handleNumberChange = (floorIndex, flatIndex, value) => {
        setUnits(prev => {
            // Create a deep copy to ensure immutability
            const updated = JSON.parse(JSON.stringify(prev));
            updated[floorIndex].flats[flatIndex].flatNumber = value;
            return updated;
        });
    };    const handleBulkFill = () => {
        const start = Number(bulkFrom);
        const end = Number(bulkTo);
        const totalFlats = units.reduce((total, floor) => total + floor.flats.length, 0);

        if (isNaN(start) || isNaN(end) || start < 1 || start > end) {
            toast.error("Please enter valid numbers. 'From' must be less than or equal to 'To'.");
            return;
        }
        
        const availableNumbers = end - start + 1;
        if (availableNumbers < totalFlats) {
            toast.warn(`Range ${start}-${end} has only ${availableNumbers} numbers, but you have ${totalFlats} flats. Some flats will not be numbered.`);
        }

        let currentNumber = start;

        setUnits(prev =>
            prev.map(floor => ({
                ...floor,
                flats: floor.flats.map(flat => {
                    if (currentNumber <= end) {
                        const updated = { ...flat, flatNumber: String(currentNumber) };
                        currentNumber++;
                        return updated;
                    }
                    return flat; // If range exhausted, leave empty
                })
            }))
        );
        
        const lastNumberUsed = currentNumber - 1;
        toast.success(`Flats numbered from ${start} to ${lastNumberUsed}. Total: ${lastNumberUsed - start + 1} flats numbered.`);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        
        const isAnyFlatNumberEmpty = units.some(floor =>
            floor.flats.some(flat => flat.flatNumber.trim() === "")
        );

        if (isAnyFlatNumberEmpty) {
            toast.error("Please ensure all flat numbers are filled before saving.");
            setIsSubmitting(false);
            return;
        }

        // 2. Prepare Payload: Update the original towerData structure
        const updatedData = JSON.parse(JSON.stringify(towerData));

        updatedData.tower.floors.forEach((floor, fIndex) => {
            floor.flats.forEach((flat, flIndex) => {
                flat.flatNumber = units[fIndex].flats[flIndex].flatNumber.trim();
            });
        });

        // 3. API Submission
        try {
            await axios.post(
                `${backendUrl}/real-estate-properties/serializeProperty`,
                updatedData,
                { headers: { secret_key: secretKey, "Content-Type": "application/json" } }
            );

            toast.success("Tower units saved successfully!");
            onComplete(); 

        } catch (err) {
            console.error("Serialization Error:", err.response?.data || err.message);
            toast.error("Failed to save tower unit numbers. Check console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render ---

    return (
        <div className="p-4 sm:p-6 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Save className="h-5 w-5 text-blue-600" /> Assign Unit Numbers
            </h3>
            
            <hr className="mb-6"/>

            {/* Bulk Fill Section */}
            <div className="flex flex-wrap gap-3 items-center mb-8 p-4 border border-blue-200 rounded-lg bg-white shadow-sm">
                <span className="font-semibold text-gray-700">Bulk Fill Range:</span>
                <input
                    type="number"
                    className="border border-gray-300 px-3 py-2 rounded w-20 text-center"
                    placeholder="From"
                    value={bulkFrom}
                    onChange={(e) => setBulkFrom(e.target.value)}
                />

                <span className="text-gray-500 font-medium">to</span>

                <input
                    type="number"
                    className="border border-gray-300 px-3 py-2 rounded w-20 text-center"
                    placeholder="To"
                    value={bulkTo}
                    onChange={(e) => setBulkTo(e.target.value)}
                />

                <button
                    onClick={handleBulkFill}
                    disabled={!bulkFrom || !bulkTo}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center gap-1"
                >
                    <ListChecks className="h-4 w-4" /> Fill
                </button>
            </div>

            {/* Floor/Flat Mapping Section */}
            {units.map((floor, fIdx) => (
                <div className="border border-gray-300 rounded-xl p-6 mb-6 bg-white shadow-md" key={fIdx}>
                    <h2 className="text-lg font-bold mb-4 text-center text-blue-800">
                        Floor - {floor.floorNumber}
                    </h2>

                    <div className="flex flex-wrap gap-4 justify-center">
                        {floor.flats.map((flat, index) => (
                            <div
                                key={flat.id}
                                className="border rounded-lg p-3 w-40 bg-gray-50 flex flex-col items-center"
                            >
                                <div className="text-xs text-gray-500 mb-1">ID: {flat.id}</div>
                                <div className="font-semibold text-center text-sm text-blue-950 mb-2">
                                    {flat.area} sq.ft
                                </div>

                                <input
                                    type="text"
                                    className="border w-full px-2 py-1 mt-1 rounded text-center font-mono focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Flat No."
                                    value={flat.flatNumber}
                                    onChange={(e) =>
                                        handleNumberChange(fIdx, index, e.target.value)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <hr className="mt-8 mb-6"/>

            {/* Submit Button */}
            <div className="text-center">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center mx-auto gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" /> Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" /> Save Serialized Units
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TowerUnitSerializer;
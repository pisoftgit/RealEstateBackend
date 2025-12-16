
import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";
import { Loader2, Save } from "lucide-react"; 
import { toast } from "react-toastify"; 

const AddPropertyUnits = ({ projectId, subPropertyTypeId, onChange }) => {
  const [units, setUnits] = useState([]);
  const [updatedUnits, setUpdatedUnits] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 

    // NEW: State to store the entire fetched structure for payload reconstruction
    const [fullStructureData, setFullStructureData] = useState(null); 

  // Bulk fill states
  const [bulkFrom, setBulkFrom] = useState("");
  const [bulkTo, setBulkTo] = useState("");

  const secretKey = localStorage.getItem("authToken");

  // Function to dynamically determine the editable key based on unit type
  const getEditableKey = (unit) => {
    // Priority: flatNumber for towers, then others for non-tower units
    if (unit.flatNumber !== undefined) return "flatNumber";
    if (unit.nameOrNumber !== undefined) return "nameOrNumber";
    if (unit.plotNumber !== undefined) return "plotNumber";
    if (unit.blockHouseNumber !== undefined) return "blockHouseNumber";
    return "nameOrNumber"; // Default for commercial/generic units
  };

  useEffect(() => {
    if (!projectId || !subPropertyTypeId) return;

    const fetchUnits = async () => {
      setLoading(true);
      setError(null);

      try {
        const payload = {
          projectId: Number(projectId),
          subPropertyTypeId: Number(subPropertyTypeId),
        };

        const res = await axios.post(
          `${backendUrl}/real-estate-properties/createTowerStructureForApi`,
          payload,
          {
            headers: {
              secret_key: secretKey,
              "Content-Type": "application/json",
            },
          }
        );

        const data = res?.data || {};
        // CRITICAL: Store the full structure data
        setFullStructureData(data); 

        let list = [];
        let unitKey = null;

        // Determine unit list and the key under which they were found
        if (data.tower?.floors?.length) {
            list = data.tower.floors.flatMap(floor => floor.flats);
            unitKey = 'tower';
        } else if (data.plots?.length) {
            list = data.plots;
            unitKey = 'plots';
        } else if (data.houseVillas?.length) {
            list = data.houseVillas;
            unitKey = 'houseVillas';
        } else if (data.commercialUnits?.length) {
            list = data.commercialUnits;
            unitKey = 'commercialUnits';
        }
        
        const initialUpdated = {};

        list.forEach((unit) => {
          const key = getEditableKey(unit);

          // Ensure the unit object always has the editable key
          if (unit[key] === undefined) {
            unit[key] = ""; 
          }

          initialUpdated[unit.id] = {
            id: unit.id,
            existingValue: unit[key] || "",
            [key]: unit[key] || "", 
          };
        });

        setUpdatedUnits(initialUpdated);
        setUnits(list);
      } catch (err) {
        console.error("Fetch Units Error:", err);
        setError("Failed to fetch units.");
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [projectId, subPropertyTypeId, secretKey, refreshKey]); 

  // --- Handlers ---
  const handleChange = (unit, value) => {
    const key = getEditableKey(unit);
    const existingValue = updatedUnits[unit.id]?.existingValue || "";
    
    if (value === existingValue && value.trim() !== "") {
      setUpdatedUnits((prev) => ({
        ...prev,
        [unit.id]: {
          ...prev[unit.id],
          [key]: value,
          error: "Value should be different from existing one",
        },
      }));
      return;
    }

    setUpdatedUnits((prev) => ({
      ...prev,
      [unit.id]: {
        ...prev[unit.id],
        [key]: value,
        error: "",
      },
    }));

    onChange && onChange(updatedUnits);
  };

  // Handle bulk fill (Sequential numbering)
  const handleBulkFill = () => {
    const start = Number(bulkFrom);
    const end = Number(bulkTo);
    const totalUnits = units.length;

    if (isNaN(start) || isNaN(end) || start < 1 || start > end) {
      toast.error("Please enter valid numbers. 'From' must be less than or equal to 'To'.");
      return;
    }

    const availableNumbers = end - start + 1;
    if (availableNumbers < totalUnits) {
      toast.warn(`Range ${start}-${end} has only ${availableNumbers} numbers, but you have ${totalUnits} units. Some units will not be numbered.`);
    }

    let currentNumber = start;
    const newUpdatedUnits = { ...updatedUnits };

    units.forEach((unit) => {
      if (currentNumber <= end) {
        const key = getEditableKey(unit);
        newUpdatedUnits[unit.id] = {
          ...newUpdatedUnits[unit.id],
          [key]: String(currentNumber),
          error: "",
        };
        currentNumber++;
      }
    });

    setUpdatedUnits(newUpdatedUnits);
    
    const lastNumberUsed = currentNumber - 1;
    toast.success(`Units numbered from ${start} to ${lastNumberUsed}. Total: ${lastNumberUsed - start + 1} units numbered.`);
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);

    if (!fullStructureData) {
        toast.error("Error: Cannot submit. Full property structure data is missing.");
        setSubmitLoading(false);
        return;
    }

    try {
        // Validation: Check for empty fields before submission
        const hasEmptyField = units.some(unit => {
            const key = getEditableKey(unit);
            return (updatedUnits[unit.id]?.[key] || unit[key] || "").trim() === "";
        });

        if (hasEmptyField) {
            toast.error("Please fill all unit numbers before submitting.");
            setSubmitLoading(false);
            return;
        }
        
        // 1. Prepare Merged Units array (with updated nameOrNumber values)
        const mergedUnits = units.map((unit) => {
          const key = getEditableKey(unit);

          const updatedValue =
            updatedUnits[unit.id]?.[key] !== undefined
              ? updatedUnits[unit.id]?.[key]
              : unit[key] || ""; 

          return {
            ...unit, 
            [key]: updatedValue, 
          };
        });

        // 2. Determine the correct key to place the units back into the full structure
        // Since the units are commercial, they go into 'commercialUnits'.
        const structureKey = fullStructureData.plots?.length ? 'plots' :
                             fullStructureData.houseVillas?.length ? 'houseVillas' :
                             fullStructureData.commercialUnits?.length ? 'commercialUnits' :
                             null;
        
        // 3. Build the final payload using the full structure template
        let finalPayload = { ...fullStructureData };

        if (structureKey) {
            // Place the merged units back into the correct array (e.g., commercialUnits)
            finalPayload[structureKey] = mergedUnits;
        } else if (fullStructureData.tower?.floors?.length) {
             // Handle the complex tower structure (This component simplifies, but for tower, 
             // you'd typically use the TowerUnitSerializer component)
             // For robustness here, we skip reconstruction and rely on the simpler unit types.
             // If this component must support tower serialization, this logic needs major expansion.
             // Since your fetch showed commercial units, we focus there.
            toast.error("Tower structure serialization is not supported in this component.");
            setSubmitLoading(false);
            return;
        }


        await axios.post(
          `${backendUrl}/real-estate-properties/serializeProperty`,
          finalPayload, // CRITICAL: Send the full structure data
          {
            headers: {
              secret_key: secretKey,
              "Content-Type": "application/json",
            },
          }
        );
        
        toast.success("Details submitted successfully! Refreshing data...");
        
        // Increment refreshKey to force the useEffect hook to re-fetch fresh data
        setRefreshKey(prev => prev + 1);

    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Failed to submit details. Try again.");
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700">
      {loading && <p className="text-blue-500 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Loading property units...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && units.length === 0 && !error && (
        <p className="text-gray-500 mb-4">No units found for this property type. Ensure the property structure has been created.</p>
      )}

      {/* Bulk Fill Section */}
      {units.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50 shadow-sm">
          <span className="font-semibold text-gray-700">Bulk Fill Range:</span>
          <input
            type="number"
            className="border border-gray-300 px-3 py-2 rounded w-24 text-center focus:ring-2 focus:ring-blue-500"
            placeholder="From"
            value={bulkFrom}
            onChange={(e) => setBulkFrom(e.target.value)}
          />

          <span className="text-gray-500 font-medium">to</span>

          <input
            type="number"
            className="border border-gray-300 px-3 py-2 rounded w-24 text-center focus:ring-2 focus:ring-blue-500"
            placeholder="To"
            value={bulkTo}
            onChange={(e) => setBulkTo(e.target.value)}
          />

          <button
            onClick={handleBulkFill}
            disabled={!bulkFrom || !bulkTo}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
          >
            <Loader2 className="h-4 w-4" /> Auto-Fill
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {units.map((unit) => {
          const key = getEditableKey(unit);
          const data = updatedUnits[unit.id];
          const value = data?.[key] || "";
          const errorMsg = data?.error;

          return (
            <div key={unit.id} className="p-4 rounded-lg border border-gray-300 bg-white shadow-sm">
              <p className="font-semibold text-gray-900 mb-2 text-sm">
                {unit.subPropertyTypeName || "Unit"} - {Number(unit.area || 0).toFixed(2)} {unit.areaUnit || ""}
              </p>

              <input
                type="text"
                value={value}
                placeholder={`Enter ${key}`}
                onChange={(e) => handleChange(unit, e.target.value)}
                className="w-full px-3 py-2 border text-sm rounded-lg focus:ring focus:border-blue-400"
              />

              {errorMsg && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
            </div>
          );
        })}
      </div>

      {/* SUBMIT */}
      {units.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center justify-center mx-auto gap-2"
            >
              {submitLoading ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                    <Save className="h-5 w-5" /> Submit Details
                </>
              )}
            </button>
          </div>
      )}
    </div>
  );
};

export default AddPropertyUnits;
       
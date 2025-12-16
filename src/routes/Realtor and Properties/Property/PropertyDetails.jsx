import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { ToastContainer, Bounce, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { backendUrl } from "../../../ProtectedRoutes/api";
import AddPropertyUnits from "./AddPropertyUnits";
import TowerUnitSerializer from "./TowerUnitSerialize";
import ExistingPropertyUnitForm from "./ExistingPropertyUnitForm";

const AddPropertyDetails = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const secretKey = localStorage.getItem("authToken");

  // --- STATE MANAGEMENT ---
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [subPropertyTypes, setSubPropertyTypes] = useState([]);
  const [towerUnits, setTowerUnits] = useState([]);
  const [structures, setStructures] = useState([]);
  const [areas, setAreas] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Selections
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedSubPropertyType, setSelectedSubPropertyType] = useState("");
  const [selectedSubPropertyTypeObj, setSelectedSubPropertyTypeObj] = useState(null);

  // **NEW STATE** for Tower Mode
  const [towerCreationMode, setTowerCreationMode] = useState('new'); // 'new' or 'existing'

  const [towerName, setTowerName] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [unitsPerFloorSame, setUnitsPerFloorSame] = useState("yes");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedAreaObj, setSelectedAreaObj] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [totalLinkableUnit, setTotalLinkableUnit] = useState(0);
  const [remainingLinkableUnits, setRemainingLinkableUnits] = useState(0);
  const [isMultiTowerSelected, setIsMultiTowerSelected] = useState(false);
  const [floorStructures, setFloorStructures] = useState([]);

  const [newlyCreatedTowerData, setNewlyCreatedTowerData] = useState(null);

  const selectedUnitId = selectedUnit?.id;

  // 🔑 UPDATED LOGIC FOR CONDITIONAL QUANTITY FIELD
  const isFlatSingleFloor = selectedUnit?.isSingleFloor && selectedUnit?.isFlat;
  const showQuantityField = isFlatSingleFloor; // True for Flat/Pent House, False for Duplex/HouseVilla

  // const showQuantityField = isFlatSingleFloor; // This is redundant but kept for clarity in the original code structure

  const resetTowerForm = () => {
    setTowerName("");
    setTotalFloors("");
    setSelectedUnit(null);
    setSelectedStructure("");
    setSelectedArea("");
    setSelectedAreaObj(null);
    setQuantity("");
    setFloorStructures([]);
    setRemainingLinkableUnits(0);
    setTotalLinkableUnit(0);
    setTowerCreationMode('new'); // Resetting mode is important
  };

  // --- Initial reset based on top-level selections ---
  useEffect(() => {
    if (selectedPropertyType) setNewlyCreatedTowerData(null);
    if (selectedSubPropertyType) resetTowerForm();
  }, [selectedPropertyType, selectedSubPropertyType]);

  // **EFFECT**: Set the full Sub-Property Type Object and check Multi-Tower status
  useEffect(() => {
    const selectedSub = subPropertyTypes.find(
      (s) => String(s.id) === String(selectedSubPropertyType)
    );
    setSelectedSubPropertyTypeObj(selectedSub || null);

    // Determine Multi-Tower status
    if (!selectedSub?.isMultiTower) {
      setNewlyCreatedTowerData(null);
    }
    setIsMultiTowerSelected(selectedSub?.isMultiTower || false);

  }, [selectedSubPropertyType, subPropertyTypes]);

  // --- Core Data Fetching Hooks (Unchanged for brevity) ---

  // FETCH PROPERTY TYPES
  useEffect(() => {
    if (!projectId) return;
    const fetchPropertyTypes = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${backendUrl}/real-estate-properties/getProjectPropertyTypes/${projectId}`,
          { headers: { secret_key: secretKey } }
        );
        setPropertyTypes(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Fetch Property Types Error:", err);
        toast.error("Failed to fetch property types.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPropertyTypes();
  }, [projectId, secretKey]);

  // FETCH SUB PROPERTY TYPES
  useEffect(() => {
    if (!selectedPropertyType) return;
    setSubPropertyTypes([]);
    setSelectedSubPropertyType("");
    const fetchSubPropertyTypes = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${backendUrl}/sub-property-types/getPropertyTypeWithSubTypesByPropertyTypeId/${selectedPropertyType}`,
          { headers: { secret_key: secretKey } }
        );
        setSubPropertyTypes(res.data?.subPropertyTypes || []);
      } catch (err) {
        console.error("Fetch Sub Property Types Error:", err);
        toast.error("Failed to fetch sub-property types.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubPropertyTypes();
  }, [selectedPropertyType, secretKey]);

  // FETCH TOWER UNITS
  useEffect(() => {
    if (!isMultiTowerSelected) return;
    const fetchTowerUnits = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/tower-property-items/getAllTowerPropertyItems`,
          { headers: { secret_key: secretKey } }
        );
        setTowerUnits(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Fetch Tower Units Error:", err);
        toast.error("Failed to fetch tower units.");
      }
    };
    fetchTowerUnits();
  }, [isMultiTowerSelected, secretKey]);

  // FETCH STRUCTURES
  useEffect(() => {
    if (!projectId || !selectedSubPropertyType || !selectedUnitId || !isMultiTowerSelected || towerCreationMode === 'existing') {
      setStructures([]);
      return;
    }
    const fetchStructures = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/real-estate-properties/getStructureByProjectIdAndSubPropertyTypeIdOfLinkableProperty`,
          {
            headers: { secret_key: secretKey },
            params: { projectId, subPropertyTypeId: selectedSubPropertyType, floorUnitId: selectedUnitId },
          }
        );
        setStructures(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Fetch Structures Error:", err);
        toast.error("Failed to fetch structures.");
      }
    };
    fetchStructures();
  }, [projectId, selectedSubPropertyType, selectedUnitId, isMultiTowerSelected, secretKey, towerCreationMode]);

  // FETCH AREAS
  useEffect(() => {
    if (!projectId || !selectedSubPropertyType || !selectedUnitId || !selectedStructure || !isMultiTowerSelected || towerCreationMode === 'existing') {
      setAreas([]);
      return;
    }
    const fetchAreas = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/real-estate-properties/getPropertyAreasBySubPropertyTypeIdAndStructureIdAndFloorUnit`,
          {
            headers: { secret_key: secretKey },
            params: {
              projectId,
              subPropertyTypeId: selectedSubPropertyType,
              floorUnitId: selectedUnitId,
              structureId: selectedStructure,
            },
          }
        );
        setAreas(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Fetch Areas Error:", err);
        toast.error("Failed to fetch areas.");
      }
    };
    fetchAreas();
  }, [projectId, selectedSubPropertyType, selectedUnitId, selectedStructure, isMultiTowerSelected, secretKey, towerCreationMode]);

  // SET SELECTED AREA OBJECT
  useEffect(() => {
    if (!selectedArea || areas.length === 0) {
      setSelectedAreaObj(null);
      return;
    }
    const foundArea = areas.find(
      (a) =>
        parseFloat(a.area) === parseFloat(selectedArea) &&
        a.areaUnit?.id != null
    );
    setSelectedAreaObj(foundArea || null);
  }, [selectedArea, areas]);

  // FETCH LINKABLE UNITS
  const fetchLinkableUnits = useCallback(async () => {
    // Only fetch if capacity tracking is relevant (Flat, Single Floor, Per Floor Same) and mode is 'new'
    if (towerCreationMode === 'existing' || !isFlatSingleFloor || unitsPerFloorSame === "no") {
      setTotalLinkableUnit(0);
      setRemainingLinkableUnits(0);
      return;
    }

    if (!selectedAreaObj || !selectedStructure || !selectedUnitId || !projectId || !selectedSubPropertyType) {
      setTotalLinkableUnit(0);
      setRemainingLinkableUnits(0);
      return;
    }

    try {
      const params = {
        projectId: Number(projectId),
        subPropertyTypeId: Number(selectedSubPropertyType),
        floorUnitId: Number(selectedUnitId),
        structureId: Number(selectedStructure),
        area: Number(selectedAreaObj.area),
        areaUnitId: Number(selectedAreaObj.areaUnit.id),
      };
      const res = await axios.get(`${backendUrl}/real-estate-properties/getTotalLinkableUnit`, {
        headers: { secret_key: secretKey },
        params,
      });
      const total = res.data?.data || res.data || 0;
      setTotalLinkableUnit(total);

      // Calculate remaining based on currently added structures for this area/structure combination
      const currentAssignedUnits = floorStructures
        .filter(fs => fs.structureId === selectedStructure && fs.areaId === selectedAreaObj.id)
        .reduce((sum, fs) => sum + (fs.quantity * (parseInt(totalFloors) || 1)), 0);

      setRemainingLinkableUnits(total - currentAssignedUnits);

    } catch (err) {
      console.error("Fetch Linkable Units Error:", err);
      setTotalLinkableUnit(0);
      setRemainingLinkableUnits(0);
      toast.error("Failed to fetch linkable units.");
    }
  }, [selectedAreaObj, selectedStructure, selectedUnitId, selectedSubPropertyType, projectId, secretKey, isFlatSingleFloor, unitsPerFloorSame, floorStructures, totalFloors, towerCreationMode]);

  // Rerun linkable unit fetch when relevant dependencies change
  useEffect(() => {
    fetchLinkableUnits();
  }, [fetchLinkableUnits]);


  // --- HANDLERS (Minimal changes, mainly capacity checks) ---
  const handleUnitChange = (e) => {
    const unitId = e.target.value;
    const unit = towerUnits.find((u) => String(u.id) === String(unitId));

    setNewlyCreatedTowerData(null);

    setSelectedUnit(unit || null);
    setSelectedStructure("");
    setSelectedArea("");
    setSelectedAreaObj(null);
    setFloorStructures([]);
    setRemainingLinkableUnits(0);
    setTotalLinkableUnit(0);
  };

  const handleStructureChange = (e) => {
    setSelectedStructure(e.target.value);
    setSelectedArea("");
    setSelectedAreaObj(null);
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
    setQuantity("");
  };

  const addFloorStructure = () => {
    if (towerCreationMode === 'existing') return; // Prevent adding if in existing mode

    if (!selectedStructure || !selectedAreaObj) {
      toast.error("Please select Structure and Area.");
      return;
    }

    // 🔑 UPDATED LOGIC: Default qty to 1 for non-Flat/SingleFloor units (e.g., Duplex, HouseVilla)
    let qty = 1;
    const totalFloorsInt = parseInt(totalFloors) || 1;

    if (showQuantityField) { // Only check/use quantity if it is a Flat/SingleFloor unit
      if (!quantity || parseInt(quantity) <= 0) {
        toast.error("Quantity must be a positive number.");
        return;
      }
      qty = parseInt(quantity);
    }

    const totalNeeded = unitsPerFloorSame === "yes" ? qty * totalFloorsInt : qty;

    const structureName = structures.find(s => String(s.id) === String(selectedStructure))?.structureName || "Unknown Structure";
    const areaUnitName = `${selectedAreaObj.area} ${selectedAreaObj.areaUnit?.unitName}`;

    const existingIndex = floorStructures.findIndex(
      (fs) => fs.structureId === selectedStructure && fs.areaId === selectedAreaObj.id
    );

    let adjustedRemaining = remainingLinkableUnits;

    // Capacity Check (Only for Flat/SingleFloor and Per Floor Same)
    if (showQuantityField && unitsPerFloorSame === "yes") {
      const existingQuantityTotal = existingIndex !== -1
        ? floorStructures[existingIndex].quantity * totalFloorsInt
        : 0;

      const unitsToAssign = totalNeeded - existingQuantityTotal;

      if (unitsToAssign > remainingLinkableUnits && existingIndex === -1) {
        toast.warn(`Cannot add ${totalNeeded} units. Only ${remainingLinkableUnits} total units are available.`);
        return;
      }
      if (unitsToAssign > remainingLinkableUnits && existingIndex !== -1) {
        toast.warn(`Cannot update. Only ${remainingLinkableUnits} additional units are available.`);
        return;
      }

      adjustedRemaining -= unitsToAssign;
    }

    if (existingIndex !== -1) {
      setFloorStructures(prev => {
        const updated = [...prev];
        updated[existingIndex] = {
          structureId: selectedStructure,
          areaId: selectedAreaObj.id,
          quantity: qty, // Use the determined quantity
          structureName,
          areaUnitName,
          areaObj: selectedAreaObj
        };
        return updated;
      });
    } else {
      setFloorStructures(prev => [
        ...prev,
        {
          structureId: selectedStructure,
          areaId: selectedAreaObj.id,
          quantity: qty, // Use the determined quantity
          structureName,
          areaUnitName,
          areaObj: selectedAreaObj
        }
      ]);
    }

    if (showQuantityField && unitsPerFloorSame === "yes") {
      setRemainingLinkableUnits(adjustedRemaining);
      toast.success(`Structure added/updated! Remaining Units: ${adjustedRemaining}`);
    } else {
      toast.success("Structure added!");
    }

    setSelectedStructure("");
    setSelectedArea("");
    setSelectedAreaObj(null);
    setQuantity("");
  };

  const removeFloorStructure = (indexToRemove) => {
    if (towerCreationMode === 'existing') return;
    const removed = floorStructures[indexToRemove];
    if (!removed) return;
    const totalFloorsInt = parseInt(totalFloors) || 1;
    const totalUnitsToRefund = unitsPerFloorSame === "yes" ? removed.quantity * totalFloorsInt : removed.quantity;

    setFloorStructures((prev) => prev.filter((_, i) => i !== indexToRemove));

    if (showQuantityField && unitsPerFloorSame === "yes") {
      setRemainingLinkableUnits((prev) => prev + totalUnitsToRefund);
    }

    toast.info("Structure removed.");
  };

  const handleSubmit = async () => {
    if (towerCreationMode === 'existing') {
      return;
    }

    if (unitsPerFloorSame === "yes" && !floorStructures.length) {
      toast.error("Add at least one floor structure!");
      return;
    }
    if (!selectedUnit?.id || !totalFloors || !towerName) {
      toast.error("Please complete Tower Details (Name, Floors, Unit).");
      return;
    }

    if (showQuantityField && unitsPerFloorSame === "yes" && remainingLinkableUnits > 0) {
      toast.warn(`There are still ${remainingLinkableUnits} total linkable units unassigned.`);
    }

    let metaDatas = [];
    if (unitsPerFloorSame === "yes" && floorStructures.length > 0) {
      metaDatas = floorStructures.map(fs => ({
        flatHouseStructureId: Number(fs.structureId),
        area: Number(fs.areaObj.area),
        noOfItems: Number(fs.quantity),
        areaUnitId: Number(fs.areaObj.areaUnit?.id)
      }));
    } else if (unitsPerFloorSame === "no") {
      metaDatas = [];
    } else if (unitsPerFloorSame === "yes" && !floorStructures.length) {
      // Should be caught by the first check, but keep this for safety
      toast.error("Please add floor structures or choose 'Units Per Floor Same: No'.");
      return;
    }

    const payload = {
      projectId: Number(projectId),
      subPropertyTypeId: Number(selectedSubPropertyType),
      towerName,
      noOfFloors: Number(totalFloors),
      isFlatPerFloorSame: unitsPerFloorSame === "yes",
      floorUnitId: Number(selectedUnit.id),
      metaDatas: metaDatas
    };

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${backendUrl}/real-estate-properties/createTowerStructureForApi`,
        payload,
        { headers: { "Content-Type": "application/json", secret_key: secretKey } }
      );
      setNewlyCreatedTowerData(res.data);
      toast.success("Tower structure created successfully! Proceed to unit serialization.");
      resetTowerForm();
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Failed to submit property details. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => navigate(-1);
  const handleSerializationComplete = () => {
    setNewlyCreatedTowerData(null);
    toast.success("Serialization complete for the new property!");
  };

  const shouldRenderNonTowerForm = selectedSubPropertyTypeObj && !isMultiTowerSelected && (selectedSubPropertyTypeObj.isCommercialUnit || selectedSubPropertyTypeObj.isPlot || selectedSubPropertyTypeObj.isHouseVilla);

  const shouldRenderTowerModeSelection = isMultiTowerSelected && selectedSubPropertyType && !newlyCreatedTowerData;

  const shouldRenderNewTowerForm = shouldRenderTowerModeSelection && towerCreationMode === 'new';

  const shouldRenderExistingTowerForm = shouldRenderTowerModeSelection && towerCreationMode === 'existing';

  const shouldRenderAddFloorStructureForm = selectedUnit && unitsPerFloorSame === "yes";
  const shouldRenderSerialization = isMultiTowerSelected && newlyCreatedTowerData;


  const renderFloorStructureFields = () => {
    return (
      <>
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Structure *</label>
          <select
            value={selectedStructure}
            onChange={handleStructureChange}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Structure</option>
            {structures.map((s) => (
              <option key={s.id} value={s.id}>{s.structureName} {s.flatHouseStructureType.structureType}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Area *</label>
          <select
            value={selectedArea}
            onChange={handleAreaChange}
            disabled={!selectedStructure}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Area</option>
            {areas.map((a) => (
              <option key={a.id} value={a.area}>{a.area} {a.areaUnit?.unitName}</option>
            ))}
          </select>
        </div>
        {/* Conditional Quantity Field: Only show if it's a Flat/Single Floor unit */}
        {showQuantityField && (
          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1">Quantity *</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={!selectedArea}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
        {/* Add Button */}
        <div className="flex items-end md:col-span-1">
          <button
            onClick={addFloorStructure}
            disabled={!selectedStructure || !selectedAreaObj || (showQuantityField && !quantity)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 w-full md:w-auto justify-center disabled:bg-gray-400"
          >
            <Plus className="h-4 w-4" /> Add Structure
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen p-5 sm:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-dm">

      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-2">
        <h1 className="text-2xl font-bold text-blue-950 dark:text-white flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 transition"
            aria-label="Go Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          Add New Property Unit
        </h1>
      </div>

      {/* Loading + Error */}
      {isLoading && (
        <div className="text-center text-lg text-blue-600 dark:text-blue-400 font-bold mb-4">
          Loading... Please wait.
        </div>
      )}

      {/* Step 1: Property Type */}
      <div className="mb-6 shadow-xl rounded-xl bg-white dark:bg-gray-800 p-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-950 dark:text-blue-200">
          Step 1: Choose Property Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Property Type *</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              value={selectedPropertyType}
              onChange={(e) => setSelectedPropertyType(e.target.value)}
            >
              <option value="">Select Property Type</option>
              {propertyTypes.map((p) => (
                <option key={`ptype-${p.id}`} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Sub Property *</label>
            <select
              disabled={!selectedPropertyType || subPropertyTypes.length === 0}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 focus:ring-blue-500 focus:border-blue-500"
              value={selectedSubPropertyType}
              onChange={(e) => setSelectedSubPropertyType(e.target.value)}
            >
              <option value="">Select Sub Property</option>
              {subPropertyTypes.map((s) => (
                <option key={`sub-${s.id}`} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {shouldRenderNonTowerForm && (
        <div className="mb-6 shadow-xl rounded-xl bg-white dark:bg-gray-800 p-6">
          <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">
            Assign {selectedSubPropertyTypeObj.name} units
          </h3>
          <AddPropertyUnits
            projectId={projectId}
            subPropertyTypeId={selectedSubPropertyType}
            subProperty={selectedSubPropertyTypeObj.name}
            unitDetails={selectedSubPropertyTypeObj.isPlot ? selectedSubPropertyTypeObj.name : undefined}
            onSerializationComplete={handleSerializationComplete}
          />
        </div>
      )}

      {/* --- START: TOWER LOGIC --- */}
      {shouldRenderTowerModeSelection && (
        <div className="shadow-xl rounded-xl bg-white dark:bg-gray-800 p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-950 dark:text-blue-200">
            Step 2: Tower Definition Mode
          </h3>
          <div className="flex items-center space-x-6 mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="towerMode"
                value="new"
                checked={towerCreationMode === 'new'}
                onChange={() => setTowerCreationMode('new')}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">New Tower</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="towerMode"
                value="existing"
                checked={towerCreationMode === 'existing'}
                onChange={() => setTowerCreationMode('existing')}
                className="form-radio h-5 w-5 text-green-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">Existing Tower</span>
            </label>
          </div>

          {shouldRenderExistingTowerForm && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold text-lg mb-3 text-green-700 dark:text-green-300">
                Assign Units to Existing Structure
              </h4>
              <ExistingPropertyUnitForm
                projectId={projectId}
                subPropertyTypeId={selectedSubPropertyType}
              />
            </div>
          )}

          {/* SCENARIO 2.2: New Tower Details Form */}
          {shouldRenderNewTowerForm && (
            <div className="mt-4 border-t pt-4">
              <h3 className="text-xl font-semibold mb-4 text-blue-950 dark:text-blue-200">
                Tower Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Tower Name *</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    value={towerName}
                    onChange={(e) => setTowerName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Total Floors *</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Units Per Floor Same?</label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="unitsSame"
                        value="yes"
                        checked={unitsPerFloorSame === "yes"}
                        onChange={() => setUnitsPerFloorSame("yes")}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="unitsSame"
                        value="no"
                        checked={unitsPerFloorSame === "no"}
                        onChange={() => setUnitsPerFloorSame("no")}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      No
                    </label>
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium mb-1">Select Unit *</label>
                  <select
                    value={selectedUnit?.id || ""}
                    onChange={handleUnitChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Unit</option>
                    {towerUnits.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {shouldRenderAddFloorStructureForm && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-200 flex items-center justify-between">
                    Add Floor Structures
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      Fields: {showQuantityField ? "Structure, Area, Quantity" : "Structure, Area only (Quantity=1)"}
                    </span>
                  </h4>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4`}>
                    {renderFloorStructureFields()}
                  </div>

                  {/* Floor Structures List */}
                  {floorStructures.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-semibold mb-2 text-blue-900 dark:text-blue-200">Added Structures Per Floor</h5>
                      <table className="min-w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-600">
                            <th className="p-2 text-left">Structure</th>
                            <th className="p-2 text-left">Area</th>
                            <th className="p-2 text-left">Qty Per Floor</th>
                            <th className="p-2 text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {floorStructures.map((fs, idx) => (
                            <tr key={`fs-${idx}`} className="border-t border-gray-200 dark:border-gray-600">
                              <td className="p-2">{fs.structureName}</td>
                              <td className="p-2">{fs.areaUnitName}</td>
                              <td className="p-2">{fs.quantity}</td>
                              <td className="p-2">
                                <button
                                  onClick={() => removeFloorStructure(idx)}
                                  className="text-red-600 hover:text-red-800 transition p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || !floorStructures.length || !totalFloors}
                      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400 mb-2 sm:mb-0"
                    >
                      {isLoading ? "Submitting..." : "Submit Tower Structure"}
                    </button>

                    {/* Only show remaining linkable units if it's the tracked type */}
                    {isFlatSingleFloor && unitsPerFloorSame === "yes" && (
                      <p className="text-sm font-medium text-right sm:text-left">
                        Total Units Capacity: <span className="font-bold text-blue-600 dark:text-blue-400">{totalLinkableUnit * (parseInt(totalFloors) || 0)}</span> |
                        Remaining Units to Assign: <span className={`font-bold ${remainingLinkableUnits > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{remainingLinkableUnits}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Handle unitsPerFloorSame === "no" and Submit Button */}
              {unitsPerFloorSame === "no" && (
                <div className="mt-6 border-t pt-6 text-orange-600 dark:text-orange-400 font-medium p-4 bg-orange-50 dark:bg-gray-700 rounded">
                  Note:Since **"Units Per Floor Same" is set to No**, you must proceed by clicking Submit Tower Structure. Unit types and quantities for each individual floor will be defined in the following serialization step.
                  <div className="mt-4">
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || !totalFloors || !towerName || !selectedUnit}
                      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400"
                    >
                      {isLoading ? "Submitting..." : "Submit Tower for Serialization"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* --- END: TOWER LOGIC --- */}


      {/* SCENARIO 3: Tower Unit Serialization */}
      {shouldRenderSerialization && (
        <div className="mt-6 shadow-xl rounded-xl bg-white dark:bg-gray-800 p-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">Step 3: Tower Unit Serialization</h3>
          <TowerUnitSerializer
            projectId={projectId}
            subPropertyTypeId={newlyCreatedTowerData.subPropertyTypeId}
            towerId={newlyCreatedTowerData.id}
            totalFloors={newlyCreatedTowerData.noOfFloors}
            unitsPerFloorSame={newlyCreatedTowerData.isFlatPerFloorSame}
            floorUnitId={newlyCreatedTowerData.floorUnitId}
            metaDatas={newlyCreatedTowerData.metaDatas}
            onSerializationComplete={handleSerializationComplete}
            towerData={newlyCreatedTowerData}
          />
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

export default AddPropertyDetails;
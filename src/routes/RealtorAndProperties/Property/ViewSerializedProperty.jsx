import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { backendUrl } from "../../../ProtectedRoutes/api";

import {
  FaBuilding,
  FaCalendarAlt,
  FaRulerCombined,
  FaRegCheckCircle,
  FaProjectDiagram,
  FaTrashAlt,
  FaEdit, // Added FaEdit icon for the Manage button
} from "react-icons/fa";

const PRIMARY_COLOR = "blue";
const PRIMARY_ACCENT = `bg-${PRIMARY_COLOR}-950 hover:bg-${PRIMARY_COLOR}-800 text-white`;
const SECONDARY_ACCENT = "bg-blue-500 text-white hover:bg-sky-600 shadow-blue-500/50";


const DetailItem = ({
  label,
  value,
  children,
  icon: Icon,
  isMultiline = false,
  className = "",
}) => (
  <div className={`p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 ${className}`}>
    <strong className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center mb-1">
      {Icon && <Icon className="mr-2 text-blue-500" />}
      {label}
    </strong>
    {children ? (
      children
    ) : (
      <span
        className={`text-gray-800 dark:text-gray-200 ${isMultiline ? "whitespace-pre-wrap" : "truncate"
          }`}
      >
        {value || "-"}
      </span>
    )}
  </div>
);

// Status Badge Component (matches ProjectSummaryPage)
const PropertyStatus = ({ status }) => {
  let baseStyle = "px-3 py-1 text-xs font-semibold rounded-full uppercase";
  let style = baseStyle;

  switch (status?.toLowerCase()) {
    case "available":
      style += " bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200";
      break;
    case "sold":
      style += " bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200";
      break;
    case "booked":
      style += " bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200";
      break;
    default:
      style += " bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }

  return <span className={style}>{status || "Unknown"}</span>;
}

const PropertyCardList = ({ items, type, isCommercial = false }) => {
  if (items.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-4">No {type.toLowerCase()} found.</p>;
  }

  const titleKey = type.includes("Plot") ? "plotNumber" : type.includes("Unit") ? "nameOrNumber" : "blockHouseNumber";
  const configKey = isCommercial ? "typeName" : "structure";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition duration-300"
        >
          <h4 className="font-bold text-lg mb-2 text-blue-950 dark:text-white">
            {type} {item[titleKey] ? `#${item[titleKey]}` : "N/A"}
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center mb-1">
            <FaRulerCombined className="mr-2 text-blue-500 dark:text-white" />
            <strong className="mr-1">Area:</strong> {item.area?.toFixed(2) || "N/A"} {item.areaUnit || "-"}
          </p>
          {item[configKey] && (
            <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center mb-2">
              <FaBuilding className="mr-2 text-blue-500  dark:text-white" />
              <strong className="mr-1">Type:</strong> {item[configKey]}
            </p>
          )}
          <div className="mt-3 flex justify-between items-center">
            <PropertyStatus status={item.availabilityStatus} />
            <button
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 transition duration-150 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900"
              onClick={() => toast.info(`Delete action for ${type} #${item[titleKey]} not implemented`)}
              title="Delete Unit"
            >
              <FaTrashAlt className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const TowerUnitsTable = ({ towers }) => {
  const [activeTowerId, setActiveTowerId] = useState(
    towers.length > 0 ? towers[0].id : null
  );

  const secret_key = localStorage.getItem("authToken")
  const [localTowers, setLocalTowers] = useState(towers);

  useEffect(() => {
    setLocalTowers(towers);
  }, [towers]);

  if (localTowers.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
        No towers found for this project.
      </p>
    );
  }

  const activeTower =
    localTowers.find((t) => t.id === activeTowerId) || localTowers[0];

  const towerFlats = activeTower?.flats || [];

  const handleManageTower = (towerName) => {
    toast.info(`Managing Tower: ${towerName}`);
  };

  const handleDeleteTower = async (towerId, towerName) => {
    if (!window.confirm(`Delete ${towerName}? This will unlink all flats.`)) return;

    try {
      const res = await axios.get(
        `${backendUrl}/floor/unLinkFlatAndDeleteTower/${towerId}`,
        {
          headers: { secret_key: secret_key },
        }
      );

      if (res.status === 200) {
        toast.success(`Tower "${towerName}" deleted successfully`);

        setLocalTowers((prev) => prev.filter((t) => t.id !== towerId));

        if (towerId === activeTowerId && localTowers.length > 1) {
          setActiveTowerId(localTowers[0].id);
        }
        return;
      }
    } catch (err) {
      console.error("Error deleting tower:", err);

      if (err.response && err.response.status === 423) {
        const backendMessage = err.response.data?.message || "Tower is locked";
        toast.error(`Cannot delete tower: ${backendMessage}. First remove the flats.`);
        return;
      }

      toast.error("Error deleting tower. Try again.");
    }
  };

  const navigate = useNavigate();

  const handleManage = (towerId) => {
    if (!towerId) {
      toast.error("Tower ID missing");
      return;
    }

    navigate(`/floor/updateTower?towerId=${towerId}`);
  };



  const handleDeleteUnit = async (floorId, itemId, unitId) => {

    if (!floorId || !itemId || !unitId) {
      toast.error("Missing required IDs for deleting unit.");
      return;
    }

    try {
      const res = await axios.delete(
        `${backendUrl}/floor/unlink/${floorId}/${itemId}/${unitId}`,
        { headers: { secret_key } }
      );

      if (res.status === 200) {
        toast.success(`Unit deleted successfully`);

        // FIXED: replaced towerId with activeTowerId
        setLocalTowers(prev =>
          prev.map(t =>
            t.id === activeTowerId
              ? { ...t, flats: t.flats.filter(f => f.id !== unitId) }
              : t
          )
        );
      }
    } catch (err) {
      if (err.response?.status === 423) {
        toast.error(err.response.data.message || "Cannot delete unit.");
        return;
      }
      toast.error("Failed to delete unit.");
    }
  };



  return (
    <div className="flex flex-col">
      <h4 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">
        Select Tower:
      </h4>

      {/* Tower Tabs */}
      <div className="flex space-x-2 border-b-2 border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto pb-1">
        {localTowers.map((tower) => (
          <div key={tower.id} className="flex items-center">
            <button
              onClick={() => setActiveTowerId(tower.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition duration-200 whitespace-nowrap border-b-4 ${tower.id === activeTowerId
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-blue-500"
                : "text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-300"
                }`}
            >

              {tower.blockHouseName} ({tower.flats?.length || 0} Units)
            </button>

            {/* Manage & Delete Buttons */}
            {tower.id === activeTowerId && (
              <div className="flex justify-center items-center space-x-2 border-blue-950/50 border-2 p-2 rounded-2xl dark:border-gray-400">

                <button
                  className="flex-1 px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-700 transition duration-150 flex items-center justify-center"
                  onClick={() => handleManage(tower.id)}
                  title="Manage Tower"
                >
                  <FaEdit className="mr-1 w-3 h-3" /> Manage
                </button>

                <div className="relative group">
                  <button
                    onClick={() =>
                      handleDeleteTower(tower.id, tower.blockHouseName)
                    }
                    className="p-1 rounded-md text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition duration-150"
                  >
                    <FaTrashAlt className="w-4 h-4" />
                  </button>

                  {/* Tooltip */}
                  <div
                    className="
                      absolute left-1/2 translate-x-1/4 top-2 z-100 
                      opacity-0 group-hover:opacity-100 
                      bg-gray-800 text-white text-xs 
                      px-2 py-2 rounded-md 
                      whitespace-nowrap
                      transition-opacity duration-200
                      pointer-events-none
                    "
                  >
                    Unlink flats & delete tower
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tower Units Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-left divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-blue-950 text-white sticky top-0">
            <tr>
              <th className="p-3 font-semibold">S/N</th>
              <th className="p-3 font-semibold">Unit No.</th>
              <th className="p-3 font-semibold">Area</th>
              <th className="p-3 font-semibold">Configuration</th>
              <th className="p-3 font-semibold">Floor</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {towerFlats.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="p-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No units found in this tower.
                </td>
              </tr>
            ) : (
              towerFlats.map((flat, index) => (
                <tr
                  key={flat.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{flat.flatNumber}</td>
                  <td className="p-3">
                    {flat.area?.toFixed(2) || "N/A"} {flat.areaUnit || "Sqr. ft."}
                  </td>
                  <td className="p-3">{flat.structure || "-"}</td>
                  <td className="p-3">
                    <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                      Floor {flat.floorNumber}
                    </span>
                  </td>
                  <td className="p-3">
                    <PropertyStatus status={flat.availabilityStatus} />
                  </td>
                  <td className="p-3">
                    <button
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 transition duration-150 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900"
                      onClick={() => handleDeleteUnit(activeTowerId, flat.towerPropertyItemId, flat.id)}
                      title="Delete Unit"
                    >
                      <FaTrashAlt className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>

          <tfoot className="bg-blue-50 dark:bg-gray-700">
            <tr>
              <td
                colSpan="5"
                className="text-right font-bold p-3 text-gray-700 dark:text-gray-200"
              >
                Total Units in {activeTower.blockHouseName}:
              </td>
              <td
                colSpan="2"
                className="font-extrabold p-3 text-blue-950 dark:text-white"
              >
                {towerFlats.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};



// -------------------- Main Component --------------------

const ViewSerializedProperty = () => {
  const { projectId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("residential");
  const [activeResidentialSubTab, setActiveResidentialSubTab] = useState("tower");
  const [activeCommercialSubTab, setActiveCommercialSubTab] = useState("plots");

  const secret_key = localStorage.getItem("authToken");

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      if (!secret_key) {
        toast.error("Authentication token not found");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          `${backendUrl}/real-estate-properties/viewSerializedProperty/projectId/${projectId}`,
          {
            headers: { secret_key },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching serialized data:", err);
        toast.error("Failed to fetch serialized data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, secret_key]);

  // --- Utility Functions ---
  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const [y, m, day] = d.split("-");
      return `${day}-${m}-${y}`;
    } catch {
      return d;
    }
  };

  const getTabClasses = (tabName, activeName, isMain = false) =>
    `px-5 py-2.5 text-sm font-semibold rounded-full transition duration-200 ${tabName === activeName
      ? isMain
        ? PRIMARY_ACCENT
        : SECONDARY_ACCENT
      : `bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600`
    }`;


  if (loading)
    return (
      <div className="p-10 text-xl font-medium flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950 mr-3"></div>
        Loading Property Serialization Data...
      </div>
    );
  if (!data)
    return (
      <p className="p-10 text-center text-red-600 dark:text-red-400 min-h-screen">
        No serialized data found for project ID: {projectId}.
      </p>
    );

  // --- Data Mapping ---
  const project = data.project1 || {};
  const residential = data.residentialProperty || {};
  const commercial = data.commercialProperty || {};

  const towers = residential.towers || [];
  const houses = residential.houseVillas1 || [];
  const residentialPlots = residential.plots1 || [];

  const commercialPlots = commercial.plots1 || [];
  const commercialUnits = commercial.commercialUnits1 || [];

  const totalResidential = towers.length + houses.length + residentialPlots.length;
  const totalCommercial = commercialPlots.length + commercialUnits.length;

  const getReraBadge = (isApproved) => {
    const status = isApproved ? "✔ Yes" : "No";
    const statusClasses = isApproved
      ? "bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100"
      : "bg-red-100 dark:bg-red-800 text-red-900 dark:text-red-100";
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-dm text-gray-900 dark:text-gray-100">

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 mb-10 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold mb-2 flex items-center text-blue-950 dark:text-white">
          <FaProjectDiagram className="mr-3 text-blue-500" />
          Serialization View
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Builder: {project.builderName || "-"}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <DetailItem icon={FaCalendarAlt} label="START DATE" value={formatDate(project.projectStartDate)} />
          <DetailItem icon={FaCalendarAlt} label="COMPLETION DATE" value={formatDate(project.projectCompletionDate)} />

          <DetailItem
            icon={FaRulerCombined}
            label="TOTAL PROJECT AREA"
            value={`${project.totalArea || "-"} ${project.areaUnit || ""}`}
          />

          <DetailItem label="POSSESSION STATUS">
            {getReraBadge(project.possessionStatus === "Ready To Move")}
          </DetailItem>

          <DetailItem icon={FaRegCheckCircle} label="RERA APPROVED">
            {getReraBadge(project.reraApproved)}
          </DetailItem>

          <DetailItem
            label="DESCRIPTION"
            value={project.description || "No description provided."}
            isMultiline
            className="lg:col-span-3"
          />
        </div>
      </div>

      <div className="mb-6 flex gap-4 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab("residential")}
          className={getTabClasses("residential", activeTab, true)}
        >
          Residential Properties ({totalResidential})
        </button>
        <button
          onClick={() => setActiveTab("commercial")}
          className={getTabClasses("commercial", activeTab, true)}
        >
          Commercial Properties ({totalCommercial})
        </button>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">

        {activeTab === "residential" && (
          <>
            <h3 className="text-xl font-bold mb-4 text-blue-950 dark:text-blue-400">Residential Property Units</h3>

            <div className="mb-6 flex flex-wrap gap-3 border-b border-gray-200 dark:border-gray-700 pb-3">
              <button
                onClick={() => setActiveResidentialSubTab("tower")}
                className={getTabClasses("tower", activeResidentialSubTab)}
              >
                Tower Units ({towers.length})
              </button>
              <button
                onClick={() => setActiveResidentialSubTab("houses")}
                className={getTabClasses("houses", activeResidentialSubTab)}
              >
                Houses/Villas ({houses.length})
              </button>
              <button
                onClick={() => setActiveResidentialSubTab("plots")}
                className={getTabClasses("plots", activeResidentialSubTab)}
              >
                Plots ({residentialPlots.length})
              </button>
            </div>

            {activeResidentialSubTab === "tower" && <TowerUnitsTable towers={towers} />}
            {activeResidentialSubTab === "houses" && <PropertyCardList items={houses} type="House/Villa" />}
            {activeResidentialSubTab === "plots" && <PropertyCardList items={residentialPlots} type="Plot" />}
          </>
        )}

        {activeTab === "commercial" && (
          <>
            <h3 className="text-xl font-bold mb-4 text-blue-950 dark:text-blue-400">Commercial Property Units</h3>

            <div className="mb-6 flex flex-wrap gap-3 border-b border-gray-200 dark:border-gray-700 pb-3">
              <button
                onClick={() => setActiveCommercialSubTab("plots")}
                className={getTabClasses("plots", activeCommercialSubTab)}
              >
                Commercial Plots ({commercialPlots.length})
              </button>
              <button
                onClick={() => setActiveCommercialSubTab("units")}
                className={getTabClasses("units", activeCommercialSubTab)}
              >
                Commercial Units ({commercialUnits.length})
              </button>
            </div>
            {activeCommercialSubTab === "plots" && <PropertyCardList items={commercialPlots} type="Commercial Plot" isCommercial={true} />}
            {activeCommercialSubTab === "units" && <PropertyCardList items={commercialUnits} type="Commercial Unit" isCommercial={true} />}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewSerializedProperty;
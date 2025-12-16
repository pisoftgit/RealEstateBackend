import React, { useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiEdit, FiEye, FiTrash2, FiMapPin, FiSearch } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";

const PRIMARY_ACCENT = "bg-blue-950 hover:bg-blue-800 text-white";
const TEXT_COLOR = "text-gray-900 dark:text-gray-100";
const INPUT_STYLE =
    "px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150";

const TableHeader = ({ children, className = "" }) => (
    <th className={`p-4 text-left text-xs font-semibold uppercase tracking-wider text-white ${className}`}>
        {children}
    </th>
);

const TableData = ({ children, className = "" }) => (
    <td className={`p-4 text-sm text-gray-800 dark:text-gray-200 ${className}`}>{children}</td>
);

const ActionButton = ({ icon: Icon, colorClass, title, onClick }) => (
    <button
        className={`p-2 rounded-full ${colorClass} transition duration-200 hover:scale-105 active:scale-95`}
        title={title}
        onClick={onClick}
    >
        <Icon size={18} />
    </button>
);

const StatusBadge = ({ status }) => {
    let color = "bg-gray-200 text-gray-800";
    if (status?.toLowerCase() === "available")
        color = "bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100";
    if (status?.toLowerCase() === "sold")
        color = "bg-red-100 dark:bg-red-800 text-red-900 dark:text-red-100";
    if (status?.toLowerCase() === "booked")
        color = "bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100";

    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}>
            {status || "Unknown"}
        </span>
    );
};

const getFilterMap = (option) => {
    switch (option) {
        case "Flat":
            return {
                filter1: { label: "Structure", key: "flatStructure" },
                filter2: { label: "Area", key: "area" },
            };
        case "House/Villa":
            return {
                filter1: { label: "Structure", key: "structure" },
                filter2: { label: "Area", key: "area" },
            };
        case "Plot":
            return {
                filter1: { label: "Plot Type", key: "plotType" },
                filter2: { label: "Area", key: "area" },
            };
        case "Commercial Units":
            return {
                filter1: { label: "Area Size", key: "area" },
                filter2: { label: "Unit No.", key: "nameOrNumber" },
            };
        default:
            return {
                filter1: { label: "Filter 1", key: null },
                filter2: { label: "Filter 2", key: null },
            };
    }
};

const SerializedPropertiesPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id: projectId } = useParams();


    const { projectName = "Unknown Project", option = "Properties", data = [] } =
        location.state || {};

    // Search & Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filter1Value, setFilter1Value] = useState("");
    const [filter2Value, setFilter2Value] = useState("");

    // MULTI SELECT
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const ITEMS_PER_PAGE = 20;

    if (!location.state) {
        return (
            <div className="p-10 text-center text-xl font-medium text-red-500 dark:bg-gray-900 min-h-screen">
                <p>
                    No project data found. Please navigate back to the{" "}
                    <span
                        className="underline cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-500"
                        onClick={() => navigate(-1)}
                    >
                        projects
                    </span>{" "}
                    page.
                </p>
            </div>
        );
    }

    const filterMap = useMemo(() => getFilterMap(option), [option]);

    // Search + Filter
    const filteredData = useMemo(() => {
        const f1Key = filterMap.filter1.key;
        const f2Key = filterMap.filter2.key;

        return data.filter((item) => {
            const text = JSON.stringify(item).toLowerCase();
            const search = text.includes(searchTerm.toLowerCase());

            let f1 = true,
                f2 = true;

            if (filter1Value && f1Key)
                f1 = String(item[f1Key] || "").toLowerCase() === filter1Value.toLowerCase();

            if (filter2Value && f2Key)
                f2 = String(item[f2Key] || "").toLowerCase() === filter2Value.toLowerCase();

            return search && f1 && f2;
        });
    }, [searchTerm, filter1Value, filter2Value, data, filterMap]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    React.useEffect(() => setCurrentPage(1), [searchTerm, filter1Value, filter2Value]);

    // -----------------------------
    // GET UNIQUE ID FUNCTION
    // -----------------------------
    const getItemUniqueId = (item) => {
        switch (option) {
            case "Flat":
                return item.flatId;
            case "House/Villa":
                return item.houseVillaId;
            case "Plot":
                return item.plotId;
            case "Commercial Units":
                return item.commercialUnitId;
            default:
                return item.id; // fallback
        }
    };

    // -----------------------------
    // SELECT ALL TOGGLE
    // -----------------------------
    const toggleSelectAll = () => {
        if (!selectAll) {
            const ids = paginatedData.map((item) => getItemUniqueId(item));
            setSelectedItems(ids);
        } else {
            setSelectedItems([]);
        }
        setSelectAll(!selectAll);
    };

    // -----------------------------
    // INDIVIDUAL ROW SELECT
    // -----------------------------
    const toggleSelectOne = (item) => {
        const uid = getItemUniqueId(item);
        if (selectedItems.includes(uid)) {
            setSelectedItems(selectedItems.filter((id) => id !== uid));
        } else {
            setSelectedItems([...selectedItems, uid]);
        }
    };

    // -----------------------------
    // TABLE HEADER
    // -----------------------------
    const renderTableHeader = () => {
        switch (option) {
            case "Flat":
                return (
                    <tr>
                        <TableHeader>
                            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                        </TableHeader>

                        <TableHeader>S/N</TableHeader>
                        <TableHeader>Tower</TableHeader>
                        <TableHeader>Floor</TableHeader>
                        <TableHeader>Flat Number</TableHeader>
                        <TableHeader>Structure</TableHeader>
                        <TableHeader>Area</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Manage</TableHeader>
                    </tr>
                );

            case "House/Villa":
                return (
                    <tr>
                        <TableHeader>
                            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                        </TableHeader>

                        <TableHeader>S/N</TableHeader>
                        <TableHeader>Unit Number</TableHeader>
                        <TableHeader>Structure</TableHeader>
                        <TableHeader>Area</TableHeader>
                        <TableHeader>Face Direction</TableHeader>
                        <TableHeader>Total Floors</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Manage</TableHeader>
                    </tr>
                );

            case "Plot":
                return (
                    <tr>
                        <TableHeader>
                            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                        </TableHeader>

                        <TableHeader>S/N</TableHeader>
                        <TableHeader>Added Date</TableHeader>
                        <TableHeader>Added By</TableHeader>
                        <TableHeader>Plot Number</TableHeader>
                        <TableHeader>Plot Type</TableHeader>
                        <TableHeader>Khasra Number</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Manage</TableHeader>
                    </tr>
                );

            case "Commercial Units":
                return (
                    <tr>
                        <TableHeader>
                            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                        </TableHeader>

                        <TableHeader>S/N</TableHeader>
                        <TableHeader>Added Date</TableHeader>
                        <TableHeader>Added By</TableHeader>
                        <TableHeader>Unit No</TableHeader>
                        <TableHeader>Area</TableHeader>
                        <TableHeader>Face Direction</TableHeader>
                        <TableHeader>Furnishing Status</TableHeader>
                        <TableHeader>Availability Status</TableHeader>
                        <TableHeader>Manage</TableHeader>
                    </tr>
                );

            default:
                return null;
        }
    };

    // -----------------------------
    // TABLE ROWS
    // -----------------------------
    const renderTableRows = () => {
        if (paginatedData.length === 0) {
            return (
                <tr>
                    <TableData colSpan={10} className="text-center py-10 text-gray-500">
                        No properties found.
                    </TableData>
                </tr>
            );
        }

        return paginatedData.map((item, index) => {
            const uniqueId = getItemUniqueId(item);
            const isChecked = selectedItems.includes(uniqueId);
            const serialNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;

            const Actions = (
                <div className="flex gap-2">
                    <ActionButton icon={FiEdit} colorClass="bg-blue-100 text-blue-600" />
                    <ActionButton icon={FiEye} colorClass="bg-green-100 text-green-600" />
                    <ActionButton icon={FiTrash2} colorClass="bg-red-100 text-red-600" />
                    <ActionButton icon={FiMapPin} colorClass="bg-purple-100 text-purple-600" />
                </div>
            );

            switch (option) {
                case "Flat":
                    return (
                        <tr key={uniqueId} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <TableData>
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleSelectOne(item)}
                                />
                            </TableData>

                            <TableData>{serialNumber}</TableData>
                            <TableData>{item.tower}</TableData>
                            <TableData>{item.floorNumber}</TableData>
                            <TableData className="font-bold text-blue-600">
                                {item.flatNumber}
                            </TableData>
                            <TableData>{item.flatStructure}</TableData>
                            <TableData>
                                {item.area} {item.areaUnitDetails?.unitName}
                            </TableData>
                            <TableData>
                                <StatusBadge status={item.availabilityStatusEnum} />
                            </TableData>
                            <TableData>{Actions}</TableData>
                        </tr>
                    );

                case "House/Villa":
                    return (
                        <tr key={uniqueId} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <TableData>
                                <input type="checkbox" checked={isChecked} onChange={() => toggleSelectOne(item)} />
                            </TableData>

                            <TableData>{serialNumber}</TableData>
                            <TableData className="font-bold text-blue-600">
                                {item.blockHouseNumber}
                            </TableData>
                            <TableData>{item.structure}</TableData>
                            <TableData>
                                {item.area} {item.areaUnit}
                            </TableData>
                            <TableData>{item.faceDirection}</TableData>
                            <TableData>{item.totalFloors}</TableData>
                            <TableData>
                                <StatusBadge status={item.availabilityStatusEnum} />
                            </TableData>
                            <TableData>{Actions}</TableData>
                        </tr>
                    );

                case "Plot":
                    return (
                        <tr key={uniqueId} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <TableData>
                                <input type="checkbox" checked={isChecked} onChange={() => toggleSelectOne(item)} />
                            </TableData>

                            <TableData>{serialNumber}</TableData>
                            <TableData>{item.addedDate}</TableData>
                            <TableData>{item.addedBy}</TableData>
                            <TableData className="font-bold text-blue-600">
                                {item.plotNumber}
                            </TableData>
                            <TableData>{item.plotType}</TableData>
                            <TableData>{item.KhasraNo}</TableData>
                            <TableData>
                                <StatusBadge status={item.availabilityStatusEnum} />
                            </TableData>
                            <TableData>{Actions}</TableData>
                        </tr>
                    );

                case "Commercial Units":
                    return (
                        <tr key={uniqueId} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <TableData>
                                <input type="checkbox" checked={isChecked} onChange={() => toggleSelectOne(item)} />
                            </TableData>

                            <TableData>{serialNumber}</TableData>
                            <TableData>{item.addedDate1}</TableData>
                            <TableData>{item.addedBy}</TableData>
                            <TableData className="font-bold text-blue-600">
                                {item.nameOrNumber}
                            </TableData>
                            <TableData>
                                {item.area} {item.areaUnit}
                            </TableData>
                            <TableData>{item.faceDirection}</TableData>
                            <TableData>{item.furnishingStatus}</TableData>
                            <TableData>
                                <StatusBadge status={item.availabilityStatusEnum} />
                            </TableData>
                            <TableData>{Actions}</TableData>
                        </tr>
                    );

                default:
                    return null;
            }
        });
    };

    // -----------------------------
    // UNIQUE FILTER VALUES
    // -----------------------------
    const getFilterOptions = (key) => {
        if (!key) return [];
        return [...new Set(data.map((d) => d[key]).filter(Boolean))].sort();
    };

    return (
        <div className={`min-h-screen p-5 md:p-10 lg:p-12 bg-gray-50 dark:bg-gray-900 ${TEXT_COLOR}`}>

            {/* Header */}
            <div className="flex justify-between items-start flex-col sm:flex-row gap-4 mb-4">
                <h1 className="text-3xl font-extrabold text-blue-950 dark:text-white">
                    Manage {option} for {projectName}
                </h1>

                <button
                    className={`px-4 py-2 rounded-lg flex items-center shadow-lg ${PRIMARY_ACCENT}`}
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft className="mr-2" /> Back to Project
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
                <div className="relative flex-grow min-w-[200px] max-w-sm">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search all properties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${INPUT_STYLE} pl-10 w-full`}
                    />
                </div>

                {/* Filter Dropdowns */}
                <select
                    className={`${INPUT_STYLE}`}
                    value={filter1Value}
                    onChange={(e) => setFilter1Value(e.target.value)}
                >
                    <option value="">{filterMap.filter1.label}</option>
                    {getFilterOptions(filterMap.filter1.key).map((val, idx) => (
                        <option key={idx} value={val}>
                            {val}
                        </option>
                    ))}
                </select>

                <select
                    className={`${INPUT_STYLE}`}
                    value={filter2Value}
                    onChange={(e) => setFilter2Value(e.target.value)}
                >
                    <option value="">{filterMap.filter2.label}</option>
                    {getFilterOptions(filterMap.filter2.key).map((val, idx) => (
                        <option key={idx} value={val}>
                            {val}
                        </option>
                    ))}
                </select>

                {/* Fill Details Button */}
                <button
                    disabled={selectedItems.length === 0}
                    onClick={() => {
                        const basePath =
                            option === "Flat"
                                ? "/flat/fillDetails/"
                                : option === "House/Villa"
                                    ? "/houseVilla/fillDetails/"
                                    : option === "Plot"
                                        ? "/plot/fillDetails/"
                                        : "/commercial/fillDetails/";

                        let paramString = `projectId=${projectId}`;

                        selectedItems.forEach((id) => {
                            paramString += `&unitIds=${id}`;
                        });

                        navigate(basePath + paramString);
                    }}
                    className={`px-4 py-2 rounded-lg font-bold ${selectedItems.length === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-700 hover:bg-blue-600 text-white"
                        }`}
                >
                    Fill Details ({selectedItems.length})
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className={PRIMARY_ACCENT}>{renderTableHeader()}</thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                        {renderTableRows()}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-between items-center">
                <p className="text-gray-600 dark:text-gray-300">
                    Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredData.length)} to{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} entries
                </p>

                <div className="flex items-center gap-3">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="font-bold text-blue-600 dark:text-blue-400">
                        Page {currentPage} / {totalPages || 1}
                    </span>

                    <button
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SerializedPropertiesPage;

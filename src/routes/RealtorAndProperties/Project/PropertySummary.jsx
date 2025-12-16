import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendUrl } from "../../../ProtectedRoutes/api";
import {
  FaBuilding,
  FaCalendarAlt,
  FaRulerCombined,
  FaRegCheckCircle,
  FaProjectDiagram,
} from "react-icons/fa";

const PRIMARY_ACCENT = "bg-blue-950 hover:bg-blue-800 text-white";
const ACCENT_OUTLINE = "border-blue-950 text-blue-950 hover:bg-blue-50";

export default function ProjectSummaryPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [summary, setSummary] = useState([]);

  const [activeMain, setActiveMain] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  const secretKey = localStorage.getItem("authToken");

  // -------------------- Fetch Project Details --------------------
  useEffect(() => {
    fetch(`${backendUrl}/real-estate-projects/getProjectById/${id}`, {
      headers: { secret_key: secretKey },
    })
      .then((res) => res.json())
      .then((data) => setProject(data))
      .catch((error) => console.error("Error fetching project:", error));
  }, [id, secretKey]);

  // -------------------- Fetch Property Summary --------------------
  useEffect(() => {
    fetch(
      `${backendUrl}/real-estate-properties/managePropertySummaryByProjectId/projectId/${id}`,
      {
        headers: { secret_key: secretKey },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const list = data.propertySummary || [];
        setSummary(list);

        if (list.length > 0) {
          setActiveMain(list[0].unitType);
          if (list[0].tabcontents?.length > 0) {
            setActiveSub(list[0].tabcontents[0].tabName);
          }
        }
      })
      .catch((error) => console.error("Error fetching summary:", error));
  }, [id, secretKey]);

  if (!project)
    return (
      <p className="p-10 text-xl font-medium dark:text-gray-200">
        Loading project details...
      </p>
    );

  // -------------------- ACTIVE SECTIONS --------------------
  const mainSection = summary.find((s) => s.unitType === activeMain);
  const subSection = mainSection?.tabcontents?.find(
    (t) => t.tabName === activeSub
  );

  // -------------------- TOTAL UNITS CALCULATION --------------------
  const calculateTotalUnits = (section) => {
    if (!section || !section.tabcontents) return 0;

    return section.tabcontents.reduce(
      (sum, tab) =>
        sum +
        tab.content.reduce((innerSum, item) => innerSum + item.totalUnits, 0),
      0
    );
  };

  // -------------------- RERA / STATUS BADGES --------------------
  const getStatusBadge = (status) => {
    const isPositive = status === "✔ Yes" || status === "Ready To Move";

    const statusClasses = isPositive
      ? "bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100"
      : "bg-purple-100 dark:bg-purple-800 text-purple-900 dark:text-purple-100";

    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses}`}
      >
        {status}
      </span>
    );
  };

  // -------------------- UI --------------------
  return (
    <div className="p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-dm text-gray-900 dark:text-gray-100">
      {/* --------- PROJECT DETAILS --------- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-blue-950 dark:text-white">
          <FaProjectDiagram className="mr-3 text-green-600" />
          Project Details
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <DetailItem icon={FaBuilding} label="BUILDER NAME" value={project.builderName} />
          <DetailItem icon={FaBuilding} label="PROJECT NAME" value={project.projectName} />
          <DetailItem icon={FaCalendarAlt} label="START DATE" value={project.projectStartDate} />
          <DetailItem icon={FaCalendarAlt} label="COMPLETION DATE" value={project.projectCompletionDate} />

          <DetailItem
            icon={FaRulerCombined}
            label="TOTAL AREA"
            value={`${project.totalArea} Sq. ft.`}
          />

          <DetailItem label="DESCRIPTION" value={project.description || "-"} isMultiline />

          <DetailItem label="POSSESSION STATUS">
            {getStatusBadge(project.possessionStatusEnum)}
          </DetailItem>

          <DetailItem icon={FaRegCheckCircle} label="RERA APPROVED">
            {getStatusBadge(project.isReraApproved ? "✔ Yes" : "No")}
          </DetailItem>
        </div>
      </div>


      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-white">
          Property Summary
        </h2>

        <div className="space-y-4">
          {summary.map((sec) => (
            <div
              key={sec.unitType}
              className="border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              {/* Main Header Button */}
              <button
                onClick={() => {
                  setActiveMain(sec.unitType);
                  if (sec.tabcontents.length > 0) {
                    setActiveSub(sec.tabcontents[0].tabName);
                  } else {
                    setActiveSub(null);
                  }
                }}
                className={`w-full flex justify-between items-center py-4 px-6 transition duration-300 rounded-lg ${
                  activeMain === sec.unitType
                    ? PRIMARY_ACCENT
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                }`}
              >
                <span className="text-lg font-bold">{sec.unitType}</span>

                {/* TOTAL UNITS BADGE - FIXED */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeMain === sec.unitType
                      ? "bg-white text-blue-950"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {calculateTotalUnits(sec)} Units
                </span>
              </button>

              {/* Sub Tabs + Table */}
              {activeMain === sec.unitType && (
                <div className="p-4 sm:p-6 bg-white dark:bg-gray-800">
                  {/* SUB TABS */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {sec.tabcontents.map((t) => (
                      <button
                        key={t.tabName}
                        onClick={() => setActiveSub(t.tabName)}
                        className={`px-4 py-2 text-sm font-medium border transition duration-300 rounded-full shadow-sm ${
                          activeSub === t.tabName
                            ? PRIMARY_ACCENT
                            : `${ACCENT_OUTLINE} bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`
                        }`}
                      >
                        {t.tabName}
                      </button>
                    ))}
                  </div>

                  {/* TABLE */}
                  <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-blue-950 text-white">
                        <tr>
                          <TableHeader>S/N</TableHeader>
                          <TableHeader>AREA</TableHeader>
                          <TableHeader>CONFIGURATION</TableHeader>
                          <TableHeader>TOTAL UNITS</TableHeader>
                          <TableHeader>ACTION</TableHeader>
                        </tr>
                      </thead>

                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {subSection?.content.map((row, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                          >
                            <TableData>{idx + 1}</TableData>
                            <TableData>
                              {row.area} {row.areaUnit}
                            </TableData>
                            <TableData>{row.structure}</TableData>
                            <TableData>{row.totalUnits}</TableData>
                            <TableData>
                              <div className="flex gap-2">
                                <TableActionButton color="green">+</TableActionButton>
                                <TableActionButton color="red">-</TableActionButton>
                              </div>
                            </TableData>
                          </tr>
                        ))}
                      </tbody>

                      {/* FOOTER */}
                      <tfoot className="bg-blue-50 dark:bg-gray-700">
                        <tr>
                          <td
                            colSpan="3"
                            className="p-4 text-left text-base font-bold text-gray-700 dark:text-gray-200"
                          >
                            Grand Total:
                          </td>
                          <td className="p-4 text-base font-extrabold text-blue-950 dark:text-white">
                            {subSection?.content.reduce(
                              (sum, c) => sum + c.totalUnits,
                              0
                            )}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const DetailItem = ({
  label,
  value,
  children,
  icon: Icon,
  isMultiline = false,
}) => (
  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
    <strong className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center mb-1">
      {Icon && <Icon className="mr-2 text-blue-500" />}
      {label}
    </strong>
    {children ? (
      children
    ) : (
      <span
        className={`text-gray-800 dark:text-gray-200 ${
          isMultiline ? "whitespace-pre-wrap" : "truncate"
        }`}
      >
        {value}
      </span>
    )}
  </div>
);

const TableHeader = ({ children }) => (
  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider">
    {children}
  </th>
);

const TableData = ({ children }) => (
  <td className="p-4 text-sm text-gray-800 dark:text-gray-200">{children}</td>
);

const TableActionButton = ({ children, color }) => {
  const colorClasses =
    color === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-red-600 hover:bg-red-700";

  return (
    <button
      className={`text-white px-2 py-1 text-sm rounded transition duration-150 shadow-md ${colorClasses}`}
    >
      {children}
    </button>
  );
};

import React, { useEffect, useState } from "react";
import { Ellipsis } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useRealEstateProjects from "../../../hooks/Realtor/useProjects";
import { ToastContainer, Bounce } from "react-toastify";
import { backendUrl } from "../../../ProtectedRoutes/api";

const ManageSerializedProjects = () => {
  const { projects, loading, error, fetchAllProjects } = useRealEstateProjects();
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  const toggleDropdown = (projectId) => {
    setDropdownOpenId(dropdownOpenId === projectId ? null : projectId);
  };

  const handleOptionClick = async (project, option) => {
    let apiUrl = "";

    switch (option) {
      case "Flat":
        apiUrl = `${backendUrl}/flats/getAllSeriealisedFlatsByProjectId/projectId/${project.id}`;
        break;
      case "House/Villa":
        apiUrl = `${backendUrl}/house-villas/getAllSerialisedHouseVillasByProjectId/projectId/${project.id}`;
        break;
      case "Plot":
        apiUrl = `${backendUrl}/plots/getAllSerialisedPlotsByProjectId/projectId/${project.id}`;
        break;
      case "Commercial Units":
        apiUrl = `${backendUrl}/commercial-units/getAllSerialisedCommercialUnitsByProjectId/projectId/${project.id}`;
        break;
      default:
        return;
    }

    try {
      const secretKey = localStorage.getItem("authToken");
      const res = await fetch(`${apiUrl}`, {
        headers: { secret_key: secretKey },
      });
      const data = await res.json();

      // Pass data via state to next page
      navigate(`/serialized-properties/projectId/${project.id}`, {
        state: { projectName: project.projectName, option, data },
      });
    } catch (err) {
      console.error("Failed to fetch serialized properties:", err);
      alert("Failed to fetch data. Please try again.");
    }

    setDropdownOpenId(null);
  };

  return (
    <div className="min-h-screen p-5 sm:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-dm">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-2">
        <h1 className="text-2xl font-bold text-blue-950 dark:text-white">
          Existing Projects
        </h1>
      </div>

      {/* Loading + Error */}
      {loading && <p className="text-center text-lg">Loading projects...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Projects Table */}
      {!loading && (
        <div className="shadow-xl rounded-xl overflow-x-auto overflow-y-scroll relative">
          <table className="min-w-full rounded-xl">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="p-4 text-left font-semibold">S/N</th>
                <th className="p-4 text-left font-semibold">Builder</th>
                <th className="p-4 text-left font-semibold">Project Name</th>
                <th className="p-4">Possession</th>
                <th className="p-4 hidden sm:table-cell">RERA</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y">
              {projects?.length ? (
                projects.map((project, index) => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition relative"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{project.builderName}</td>
                    <td className="p-4 font-semibold">{project.projectName}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100">
                        {project.possessionStatusEnum}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      {project.reraId} - {project.reraNumber}
                    </td>

                    <td className="p-4 flex justify-center relative">
                      {/* Ellipsis Button */}
                      <button
                        onClick={() => toggleDropdown(project.id)}
                        className="p-2 rounded-full bg-blue-50 dark:bg-gray-700 hover:bg-blue-100"
                      >
                        <Ellipsis className="h-5 w-5" />
                      </button>

                      {/* Dropdown Menu */}
                      {dropdownOpenId === project.id && (
                        <div className="absolute top-full z-100 right-0 mt-2 w-48 rounded-lg shadow-xl border-2 border-gray-600 bg-white dark:bg-gray-700 p-2 z-50">
                          {["Flat", "House/Villa", "Plot", "Commercial Units"].map((option) => (
                            <button
                              key={option}
                              onClick={() => handleOptionClick(project, option)}
                              className="block w-full text-left px-4 py-2 text-base hover:bg-gray-200 dark:hover:bg-gray-7600 rounded dark:hover:text-black"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-10 text-center">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer
        className="!w-[600px] !max-w-[90vw]"
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={false}
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default ManageSerializedProjects;

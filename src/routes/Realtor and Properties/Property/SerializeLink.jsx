import React, { useEffect } from "react";
import { ArrowDown01, TableOfContents } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useRealEstateProjects from "../../../hooks/Realtor/useProjects";
import { ToastContainer, Bounce } from "react-toastify";

const SerializeProjects = () => {
  const navigate = useNavigate();

  const {
    projects,
    loading,
    error,
    fetchAllProjects,
  } = useRealEstateProjects();

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

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
        <div className="shadow-xl rounded-xl overflow-x-auto overflow-y-hidden">
          <table className="min-w-full rounded-xl">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="p-4 text-left font-semibold">S/N</th>
                <th className="p-4 text-left font-semibold">Builder</th>
                <th className="p-4 text-left font-semibold">Project Name</th>
                <th className="p-4">Possession</th>
                <th className="p-4 hidden sm:table-cell">RERA</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y">
              {projects?.length ? (
                projects.map((project, index) => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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

                    <td className="p-4 flex gap-4 items-center justify-center">

                      {/* Serialize Property Button */}
                      <button
                        onClick={() =>
                          navigate(
                            `/Realtor&Properties/Property/Serialize&Link/PropertyDetails/${project.id}`
                          )
                        }
                        className="p-2 rounded-full bg-green-50 dark:bg-gray-700 hover:bg-green-100"
                      >
                        <ArrowDown01 />
                      </button>

                      {/* View Serialized Property */}
                      <button
                        onClick={() =>
                          navigate(`/Realtor&Properties/Property/ViewSerialized/PropertyDetails/${project.id}`)
                        }
                        className="p-2 rounded-full bg-blue-50 dark:bg-gray-700 hover:bg-blue-100"
                      >
                        <TableOfContents className="h-5 w-5" />
                      </button>

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

export default SerializeProjects;

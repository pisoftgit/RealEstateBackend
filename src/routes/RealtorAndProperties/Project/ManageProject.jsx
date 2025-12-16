import React, { useEffect, useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiX,
  FiFileText,
} from "react-icons/fi";
import { Ellipsis, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useRealEstateProjects from "../../../hooks/Realtor/useProjects";
import AddPropertySummary from "./AddPropertySummary";

import { ToastContainer, Bounce } from "react-toastify";
import { backendUrl } from "../../../ProtectedRoutes/api";

const ManageProjects = () => {
  const {
    projects,
    loading,
    error,
    fetchAllProjects,
    deleteProject,
  } = useRealEstateProjects();

  const navigate = useNavigate();

  const [viewingProject, setViewingProject] = useState(null);
  const [projectMedia, setProjectMedia] = useState([]);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [summaryProject, setSummaryProject] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const secretKey = localStorage.getItem("authToken");

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  // Open modal and fetch project media
  const openViewModal = async (project) => {
    setViewingProject(project);
    setDropdownOpenId(null);

    try {
      const res = await fetch(
        `${backendUrl}/real-estate-projects/getProjectMediaByProjectId/${project.id}`,
        { headers: { secret_key: secretKey } }
      );

      const mediaList = await res.json();

      // Use mediaBase64 to create proper data URIs
      const imagesWithSrc = mediaList.map((m) => ({
        ...m,
        src: m.mediaBase64
          ? `data:image/jpeg;base64,${m.mediaBase64}`
          : null,
      }));

      setProjectMedia(imagesWithSrc);
    } catch (err) {
      console.error("Failed to load media:", err);
      setProjectMedia([]);
    }
  };

  const closeModal = () => {
    setViewingProject(null);
    setSummaryProject(null);
    setDropdownOpenId(null);
    setProjectMedia([]);
    setPreviewImage(null);
  };

  const toggleDropdown = (projectId) => {
    setDropdownOpenId(dropdownOpenId === projectId ? null : projectId);
  };

  const handleAddSummary = (project) => {
    setSummaryProject(project);
    setDropdownOpenId(null);
  };

  const handleDeleteProjectConfirm = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
      } catch (err) {
        console.error("Failed to delete project.");
      }
    }
  };

  return (
    <div className="min-h-screen p-5 sm:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-dm">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-2">
        <h1 className="text-2xl font-bold text-blue-950 dark:text-white">
          Manage Projects
        </h1>
      </div>

      {/* Loading + Error */}
      {loading && <p className="text-center text-lg">Loading projects...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Projects Table */}
      {!loading && (
        <div className="shadow-xl rounded-xl overflow-x-auto">
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

                    <td className="p-4 flex gap-2 items-center">
                      {/* View Modal */}
                      <button
                        onClick={() => openViewModal(project)}
                        className="p-2 rounded-full bg-green-50 dark:bg-gray-700 hover:bg-green-100"
                      >
                        <FiEye />
                      </button>

                      {/* Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(project.id)}
                          className="p-2 rounded-full bg-blue-50 dark:bg-gray-700 hover:bg-blue-100"
                        >
                          <Ellipsis className="h-5 w-5" />
                        </button>

                        {dropdownOpenId === project.id && (
                          <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-white dark:bg-gray-700 p-2 z-50">
                            <button
                              onClick={() => handleAddSummary(project)}
                              className="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <FiFileText className="inline-block mr-2" size={20} /> Add Property Summary
                            </button>

                            <button
                              onClick={() => navigate(`/project-summary/${project.id}`)}
                              className="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <Eye className="inline-block mr-2" size={20} /> View Property Summary
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Edit */}
                      <button
                        onClick={() => navigate(`/update-project/${project.id}`)}
                        className="p-2 rounded-full bg-purple-50 dark:bg-gray-700 hover:bg-purple-100"
                      >
                        <FiEdit />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteProjectConfirm(project.id)}
                        className="p-2 rounded-full bg-red-50 dark:bg-gray-700 hover:bg-red-100"
                      >
                        <FiTrash2 />
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

      {/* Summary Modal */}
      {summaryProject && (
        <div className="fixed inset-0 bg-black/70 max-w-full mx-auto flex items-center justify-center z-50 p-4">
          <div className="p-6">
            <AddPropertySummary project={summaryProject} onClose={closeModal} />
          </div>
        </div>
      )}

      {/* View Project Modal */}
      {viewingProject && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 mx-auto justify-center items-center max-w-5xl rounded-xl shadow-xl overflow-auto max-h-[95vh]">

            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center dark:border-gray-700">
              <h2 className="text-2xl font-bold text-green-700">
                {viewingProject.projectName}
              </h2>
              <FiX size={24} onClick={closeModal} className="cursor-pointer" />
            </div>

            {/* Body */}
            <div className="p-6 space-y-8 overflow-y-auto max-h-[80vh]">
              {/* Basic Info */}
              <section>
                <h3 className="text-xl font-bold mb-4">Basic Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <p><strong>Builder:</strong> {viewingProject.builderName}</p>
                  <p><strong>Possession:</strong> {viewingProject.possessionStatusEnum}</p>
                  <p><strong>Start:</strong> {viewingProject.projectStartDate}</p>
                  <p><strong>Completion:</strong> {viewingProject.projectCompletionDate}</p>
                </div>
              </section>

              {/* RERA */}
              <section>
                <h3 className="text-xl font-bold mb-4">RERA Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <p><strong>Approved:</strong> {viewingProject.isReraApproved ? "Yes" : "No"}</p>
                  <p><strong>RERA ID:</strong> {viewingProject.reraId}</p>
                  <p><strong>RERA Number:</strong> {viewingProject.reraNumber}</p>
                </div>
              </section>

              {/* Media */}
              <section>
                <h3 className="text-xl font-bold mb-4">Project Media</h3>

                {projectMedia.length ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {projectMedia.map((media) => {
                      if (!media.src) return null;
                      return (
                        <img
                          key={media.id}
                          src={media.src}
                          alt={media.mediaLabel}
                          className="rounded-lg shadow-md border object-cover h-40 cursor-pointer"
                          onClick={() => setPreviewImage(media.src)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No media found.</p>
                )}

              </section>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl"
          />
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

export default ManageProjects;

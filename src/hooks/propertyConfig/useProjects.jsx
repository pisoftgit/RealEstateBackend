import { useState, useEffect } from "react";
import axios from "axios";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserId = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      return userData?.user?.id || null;
    } catch (err) {
      console.error("Error parsing userData from localStorage:", err);
      return null;
    }
  };

  const builderId = getUserId();

  // Fetch all projects for the builder
  const fetchProjects = async () => {
    if (!builderId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/real-estate-projects/getProjectsByBuilderId/${builderId}`
      );
      setProjects(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Save a new project
  const saveProject = async (projectData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { ...projectData, addedById: builderId };
      const response = await axios.post(
        "/real-estate-projects/saveProject",
        payload
      );
      await fetchProjects();
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing project
  const updateProject = async (projectId, projectData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `/real-estate-projects/updateProject/${projectId}`,
        projectData
      );
      await fetchProjects(); // Refresh the project list
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `/real-estate-projects/deleteProject/${projectId}`
      );
      await fetchProjects(); // Refresh the project list
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch projects when the component mounts
  useEffect(() => {
    if (builderId) {
      fetchProjects();
    }
  }, [builderId]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    saveProject,
    updateProject,
    deleteProject,
  };
};

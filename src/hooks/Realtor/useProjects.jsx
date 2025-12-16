import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../ProtectedRoutes/api";
import { toast } from "react-toastify";

const useRealEstateProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all projects (global, not by builder)
  const fetchAllProjects = useCallback(async () => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const response = await axios.get(
        `${backendUrl}/real-estate-projects/getAllProjects`,
        { headers: { secret_key: secretKey } }
      );
      setProjects(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all projects by builder ID
  const fetchProjectsByBuilderId = useCallback(async (builderId) => {
    setLoading(true);
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const response = await axios.get(
        `${backendUrl}/real-estate-projects/getProjectsByBuilderId/${builderId}`,
        { headers: { secret_key: secretKey } }
      );
      setProjects(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single project by ID
  const fetchProjectById = useCallback(async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const response = await axios.get(
        `${backendUrl}/real-estate-projects/getProjectById/${id}`,
        { headers: { secret_key: secretKey } }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching project by ID:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // Update project details
  const updateProject = async (id, projectData) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      await axios.put(
        `${backendUrl}/real-estate-projects/updateProject/${id}`,
        projectData,
        { headers: { secret_key: secretKey } }
      );
      fetchProjectsByBuilderId(projectData.builderId);
    } catch (err) {
      console.error("Error updating project:", err?.response?.data || err.message);
      throw err;
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      await axios.delete(
        `${backendUrl}/real-estate-projects/deleteProject/${id}`,
        { headers: { secret_key: secretKey } }
      );

      toast.success("Project deleted successfully!");
      fetchAllProjects();
    } catch (err) {
      const status = err?.response?.status;

      if (status === 423) {
        const backendMessage = err?.response?.data || "A data integrity issue occurred.";
        toast.warning(backendMessage);
        console.warn("Backend 423 message:", backendMessage);
        return;
      }

      const errorMsg = err?.response?.data?.message || err.message;
      toast.error(`Failed to delete project: ${errorMsg}`);
      console.error("Error deleting project:", errorMsg);
      throw err;
    }
  };

  // Fetch project media
  const fetchProjectMedia = async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");
      if (!secretKey) throw new Error("Missing authentication token");

      const response = await axios.get(
        `${backendUrl}/real-estate-projects/getProjectMediaByProjectId/${id}`,
        { headers: { secret_key: secretKey } }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching project media:", err?.response?.data || err.message);
      throw err;
    }
  };

  // Fetch projects on component mount
  useEffect(() => {
    if (projects.length === 0) {
      fetchAllProjects();
    }
  }, [fetchAllProjects, projects.length]);

  return {
    projects,
    loading,
    error,
    fetchAllProjects,
    fetchProjectsByBuilderId,
    fetchProjectById,  
    updateProject,
    deleteProject,
    fetchProjectMedia,
  };
};

export default useRealEstateProjects;

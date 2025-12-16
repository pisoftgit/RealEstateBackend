import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { backendUrl } from '../../../ProtectedRoutes/api';

const getAuthHeaders = () => {
  const secretKey = localStorage.getItem("authToken"); 
  
  if (!secretKey) {
    console.error("Authentication token (authToken) not found in localStorage.");
  }

  return {
    headers: {
      'Content-Type': 'application/json',
      'secret_key': secretKey || '', 
    },
  };
};

const useDepartmentAPI = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${backendUrl}/department/all`,
        getAuthHeaders()
      );
      // Assuming your API returns an array of departments
      setDepartments(response.data.data || response.data); 
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch departments');
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch departments on initial load
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Add Department
  const addDepartment = async (departmentName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${backendUrl}/department/add`,
        { departmentName },
        getAuthHeaders()
      );
      const newDept = response.data.data || response.data; 
      
      await fetchDepartments(); 
      return newDept;
    } catch (err) {
      console.error("Error adding department:", err);
      setError(err.response?.data?.message || err.message || 'Failed to add department');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update Department
  const updateDepartment = async (id, departmentName) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(
        `${backendUrl}/department/update/${id}`,
        { departmentName },
        getAuthHeaders()
      );
      
      await fetchDepartments(); 
      return true;
    } catch (err) {
      console.error("Error updating department:", err);
      setError(err.response?.data?.message || err.message || 'Failed to update department');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete Department
  const deleteDepartment = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(
        `${backendUrl}/department/delete/${id}`,
        getAuthHeaders()
      );
      
      await fetchDepartments(); 
      return true;
    } catch (err) {
      console.error("Error deleting department:", err);
      setError(err.response?.data?.message || err.message || 'Failed to delete department');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  };
};

export default useDepartmentAPI;
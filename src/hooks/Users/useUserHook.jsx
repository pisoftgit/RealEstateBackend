// src/hooks/useUserApi.js
import { useState } from "react";
import backendUrl from "../../ProtectedRoutes/api";

export default function useUserApi() {
  const [loading, setLoading] = useState(false);

  const authToken = localStorage.getItem("authToken");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const loggedId = userData?.user?.id;

  const headers = {
    "Content-Type": "application/json",
    "secret_key": authToken, 
  };

  // ⭐ GET USER BY ID
  const getUser = async (id = loggedId) => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/user/get/${id}`, {
        method: "GET",
        headers,
      });
      return await res.json();
    } finally {
      setLoading(false);
    }
  };

  // ⭐ ADD OR UPDATE USER
  const saveUser = async (body) => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/user/add`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      return await res.json();
    } finally {
      setLoading(false);
    }
  };

  // ⭐ DELETE USER
  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/user/delete/${id}`, {
        method: "DELETE",
        headers,
      });
      return await res.json();
    } finally {
      setLoading(false);
    }
  };

  return { loading, getUser, saveUser, deleteUser };
}

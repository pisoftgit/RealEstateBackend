import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const getInitialState = () => {
  const token = localStorage.getItem("authToken");
  const userData = localStorage.getItem("userData");
  const expiry = localStorage.getItem("authExpiry");

  const now = new Date().getTime();
  if (expiry && now > Number(expiry)) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("authExpiry");
    return {
      isAuthenticated: false,
      userSessionData: null,
    };
  }

  return {
    isAuthenticated: !!token,
    userSessionData: userData ? JSON.parse(userData) : null,
  };
};

export const AuthProvider = ({ children }) => {
  const initialState = getInitialState();

  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const [userSessionData, setUserSessionData] = useState(initialState.userSessionData);

  const login = (responseData) => {
    const expiryTime = new Date().getTime() + 45 * 60 * 1000;

    localStorage.setItem("authToken", responseData.secretKey);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        user: responseData.user,
        organization: responseData.organization,
        branch: responseData.branch,
        currentDay: responseData.currentDay,
        privileges: responseData.privileges,
      })
    );
    localStorage.setItem("authExpiry", expiryTime.toString());

    setIsAuthenticated(true);
    setUserSessionData({
      user: responseData.user,
      organization: responseData.organization,
      branch: responseData.branch,
      currentDay: responseData.currentDay,
      privileges: responseData.privileges,
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("authExpiry");
    setIsAuthenticated(false);
    setUserSessionData(null);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const expiry = localStorage.getItem("authExpiry");
    if (!expiry) return;

    const now = new Date().getTime();
    const remainingTime = Number(expiry) - now;

    if (remainingTime <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
      alert("Your session has expired. Please log in again.");
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userSessionData,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

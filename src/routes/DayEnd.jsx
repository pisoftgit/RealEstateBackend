import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../ProtectedRoutes/api";

const DayEnd = () => {
  const [closeDay, setCloseDay] = useState("");
  const [openDay, setOpenDay] = useState("");
  const [currentDayId, setCurrentDayId] = useState(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [closedDays, setClosedDays] = useState([]);
  const [loadingClose, setLoadingClose] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch current day on mount
  useEffect(() => {
    const fetchCurrentDay = async () => {
      try {
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) throw new Error("User data missing");

        const userData = JSON.parse(userDataString);
        const userId = userData.user?.id;
        const currentDate = userData.currentDay; // e.g. "2025-04-16"
        if (!userId || !currentDate) throw new Error("User ID or current date missing");

        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Auth token missing");

        // GET current day data
        const url = `${backendUrl}/current_day/close/${currentDate}/${userId}`;
        const res = await axios.get(url, { headers: { secret_key: token } });
        const data = res.data;

        setCloseDay(data.date);
        setOpenDay(data.date);
        setCurrentDayId(data.currentDayId);
        setAccessGranted(data.accessGranted);
        setClosedDays(data.closedDays || []);
      } catch (error) {
        console.error("Failed to fetch current day:", error);
        setMessage("Failed to load current day.");
      }
    };

    fetchCurrentDay();
  }, []);

  // Close Day
  const handleCloseDay = async () => {
    if (!currentDayId) {
      setMessage("Current day ID not found.");
      return;
    }

    setLoadingClose(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("authToken");

      // get close current day
      const res = await axios.get(
        `${backendUrl}/current_day/close/${currentDayId}`,
        { headers: { secret_key: token } }
      );

      const nextDay = res.data.nextDay;
      if (nextDay) {
        setCloseDay(nextDay.date);
        setOpenDay(nextDay.date);
        setCurrentDayId(nextDay.id);
        setAccessGranted(true);
      }

      setMessage(res.data.message || `Day closed for ${closeDay}`);
    } catch (error) {
      console.error("Failed to close day:", error);
      setMessage("Failed to close day.");
    } finally {
      setLoadingClose(false);
    }
  };

  // Open Day
  const handleOpenDay = async () => {
    if (!openDay) {
      setMessage("Please select a date to open.");
      return;
    }

    setLoadingOpen(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("authToken");
      await axios.get(
        `${backendUrl}/current_day/open?checkIn=${openDay}`,
        { headers: { secret_key: token } }
      );

      setMessage(`Day opened for ${openDay}`);
    } catch (error) {
      console.error("Failed to open day:", error);
      setMessage("Failed to open day.");
    } finally {
      setLoadingOpen(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-6">Day End</h1>
      <div className="flex gap-6">

        {/* Close Day */}
        <div className="border rounded-md p-4 w-1/2 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-4">
            Close <span className="text-red-600">Day</span>
          </h2>
          <input
            type="date"
            value={closeDay}
            className="border p-2 rounded w-full mb-4"
            disabled
          />
          <button
            onClick={handleCloseDay}
            disabled={loadingClose || !currentDayId}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loadingClose ? "Closing..." : "Close Day"}
          </button>
        </div>

        {/* Open Day */}
        <div className="border rounded-md p-4 w-1/2 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-4">
            Open <span className="text-red-600">Day</span>
          </h2>
          <input
            type="date"
            value={openDay}
            onChange={(e) => setOpenDay(e.target.value)}
            className="border p-2 rounded w-full mb-4"
            disabled={!accessGranted}
          />
          <button
            onClick={handleOpenDay}
            disabled={loadingOpen || !accessGranted}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loadingOpen ? "Opening..." : "Open Day"}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="mt-6 text-center font-semibold text-gray-700 dark:text-gray-300">
          {message}
        </div>
      )}
    </div>
  );
};

export default DayEnd;

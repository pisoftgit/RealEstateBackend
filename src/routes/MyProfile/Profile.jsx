import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSun,
  FiMoon,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};
import { backendUrl } from "../../ProtectedRoutes/api";


const ProfilePage = () => {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleThemeToggle = () => {
    const html = document.documentElement;
    const newIsDark = !html.classList.contains("dark");
    html.classList.toggle("dark");
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  // ------------ FETCH USER PROFILE ------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {

        const rawUser = localStorage.getItem("userData");
        const userData = rawUser ? JSON.parse(rawUser) : null;

        if (!userData) return;

        const userId = userData?.user?.id;
        const authToken = localStorage.getItem("authToken");

        const response = await fetch(`${backendUrl}/user/myprofile/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            secret_key: authToken,
          },
        });

        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Profile fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-10 text-xl">Loading...</div>;
  if (!userProfile) return <div className="p-10 text-xl">No profile found</div>;

  // -------------- HELPER COMPONENTS --------------
  const ProfileDetailItem = ({ label, value, icon: Icon }) => (
    <motion.div
      className="flex flex-col p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
        {Icon && <Icon className="mr-2 text-blue-600 dark:text-blue-400 w-4 h-4" />}
        {label}
      </div>
      <p className="text-gray-900 dark:text-gray-100 text-base font-medium break-words">
        {value}
      </p>
    </motion.div>
  );

  const SidebarDetailRow = ({ label, value }) => (
    <tr className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <td className="font-semibold py-3 pr-4 text-gray-700 dark:text-gray-300 w-24">
        {label}
      </td>
      <td className="py-3 text-gray-900 dark:text-gray-100 font-medium">{value}</td>
    </tr>
  );

  return (
    <motion.div
      className="min-h-screen p-8 font-sans relative bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto mb-10">
        <motion.h1
          className="text-4xl font-extrabold text-gray-900 dark:text-white"
          variants={itemVariants}
        >
          My Profile
        </motion.h1>
      </div>

      <motion.div
        className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 rounded-2xl shadow-2xl overflow-hidden
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* LEFT SIDEBAR */}
        <div className="lg:w-1/3 p-6 flex flex-col items-center justify-start border-r border-gray-200 dark:border-gray-700
          bg-blue-50 dark:bg-gray-900/50">

          <motion.div
            className="w-36 h-36 bg-blue-950 dark:bg-blue-500 rounded-full mb-6 flex items-center justify-center ring-4 ring-blue-600 dark:ring-blue-400"
            variants={itemVariants}
          >
            <FiUser className="text-white w-14 h-14" />
          </motion.div>

          <motion.h2
            className="text-2xl font-bold text-blue-950 dark:text-blue-300 mb-6"
            variants={itemVariants}
          >
            {userProfile.name}
          </motion.h2>

          <motion.table className="w-full text-sm text-left border-collapse" variants={containerVariants}>
            <tbody>
              <SidebarDetailRow label="Phone" value={userProfile.phone} />
              <SidebarDetailRow label="User Code" value={userProfile.usercode} />
              <SidebarDetailRow label="ID" value={userProfile.id} />
            </tbody>
          </motion.table>
        </div>

        {/* RIGHT DETAILS */}
        <div className="lg:w-2/3 p-8">
          <motion.h2
            className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700"
            variants={itemVariants}
          >
            Contact & Personal Details
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            <ProfileDetailItem label="Full Name" value={userProfile.name} icon={FiUser} />
            <ProfileDetailItem label="Phone" value={userProfile.phone} icon={FiPhone} />
            <ProfileDetailItem label="User Code" value={userProfile.usercode} icon={FiUser} />

            <div className="sm:col-span-2">
              <ProfileDetailItem label="Password (Encrypted)" value={userProfile.password} icon={FiMail} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;

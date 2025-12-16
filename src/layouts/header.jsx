import { useTheme } from "@/hooks/use-theme";
import { ChevronsLeft, Moon, Sun, Calendar } from "lucide-react";
import PropTypes from "prop-types";
import { useAuth } from "../ProtectedRoutes/authcontext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const Header = ({ collapsed, setCollapsed }) => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  const [username, setUsername] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      const parsed = JSON.parse(userData);
      setUsername(parsed.user?.name || "");
      setCompany(parsed.organization?.name || "");
      setEmail(parsed.user?.officialEmail || parsed.organization?.email || "");
    }
  }, []);

  const dateString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const initials = username
    ? username
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="relative z-20 font-dm flex h-[64px] items-center justify-between bg-white px-5 shadow-sm dark:bg-gray-900 transition-colors">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          className="size-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronsLeft
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>

        <div>
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">
            {company || "Company"}
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Date */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <Calendar size={18} className="text-gray-700 dark:text-gray-300" />
          <span className="text-sm text-gray-800 dark:text-gray-200">
            {dateString.split(",").join(" •")}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          className="size-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun size={20} className="hidden dark:block text-white" />
          <Moon size={20} className="dark:hidden text-blue-400" />
        </button>

        {/* Avatar + Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="size-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-white font-semibold"
          >
            <img
              src="/image.png"
              alt="Profile"
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="w-full h-full object-cover"
            />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-3 w-52 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {email || "No email"}
                  </p>
                </div>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-500/30 transition"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};

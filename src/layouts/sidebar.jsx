import { forwardRef, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { navbarLinks } from "@/constants";
import logoLight from "@/assets/Logo.jpg";
import logoDark from "@/assets/Logo.jpg";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [openNestedMenu, setOpenNestedMenu] = useState(null);
  const [username, setusername] = useState("")
  
  useEffect(()=>{
    
  const userData = localStorage.getItem("userData");

  if (userData) {
    const parsed = JSON.parse(userData);
    setusername(parsed.user?.name || "");
  }

  },[])


  const location = useLocation();

  const toggleSubMenu = (path) => {
    setOpenSubMenu(openSubMenu === path ? null : path);
  };

  const toggleNestedMenu = (path) => {
    setOpenNestedMenu(openNestedMenu === path ? null : path);
  };
  
  const isSubPathActive = (subMenu) => {
    return subMenu?.some(
      (subLink) =>
        subLink.path === location.pathname ||
        subLink.subMenu?.some((nested) => nested.path === location.pathname)
    );
  };

  const renderSubMenu = (subMenu, parentPath, level = 1) => {
    return (
      <div
        className={cn(
          "ml-5 mt-1 flex flex-col font-dm",
          level > 1 && "ml-5"
        )}
      >
        {subMenu.map((subLink) => {
          const active =
            subLink.path === location.pathname ||
            isSubPathActive(subLink.subMenu);
          return (
            <div key={subLink.label}>
              <NavLink
                to={subLink.path}
                onClick={(e) => {
                  if (subLink.subMenu) {
                    e.preventDefault();
                    toggleNestedMenu(subLink.path);
                  }
                }}
                className={({ isActive }) =>
                  cn(
                    "sidebar-item !py-1 !pl-4 text-sm hover:!bg-blue-100 dark:hover:!bg-gray-800 transition-all",
                    active && "active !text-white dark:!text-white font-semibold",
                    level > 1 && "pl-6"
                  )
                }
              >
                <subLink.icon size={15} className="flex-shrink-0" />
                <p className="whitespace-nowrap">{subLink.label}</p>

                {subLink.subMenu && (
                  <svg
                    className={cn(
                      "ml-auto h-3 w-3 transform transition-transform",
                      openNestedMenu === subLink.path ? "rotate-90" : "rotate-0"
                    )}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </NavLink>

              {/* Recursive nested submenu */}
              {subLink.subMenu &&
                openNestedMenu === subLink.path &&
                renderSubMenu(subLink.subMenu, subLink.path, level + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white dark:border-slate-700 dark:bg-gray-900 transition-all",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[260px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      {/* Logo */}
      <div className="flex gap-x-3 p-3">
        <img
          src={logoLight}
          alt="Logo"
          className="dark:hidden h-10 w-10 rounded-full"
        />
        <img
          src={logoDark}
          alt="Logo"
          className="hidden dark:block h-10 w-10 rounded-full"
        />
        {!collapsed && (
          <p className="text-lg font-dm font-bold text-slate-900 dark:text-slate-50">
            {username}
          </p>
        )}
      </div>

      {/* Links */}
      <div className="flex w-full flex-col gap-y-2 font-dm overflow-y-auto overflow-x-hidden p-2 [scrollbar-width:_thin]">
        {navbarLinks.map((navbarLink) => (
          <nav key={navbarLink.title} className="sidebar-group font-dm">
            {!collapsed && (
              <p className="sidebar-group-title">{navbarLink.title}</p>
            )}

            {navbarLink.links.map((link) => {
              const active =
                link.path === location.pathname || isSubPathActive(link.subMenu);
              return (
                <div key={link.label}>
                  <NavLink
                    to={link.path}
                    onClick={(e) => {
                      if (link.subMenu) {
                        e.preventDefault();
                        toggleSubMenu(link.path);
                      }
                    }}
                    className={({ isActive }) =>
                      cn(
                        "sidebar-item",
                        collapsed && "md:w-[45px]",
                        (isActive || active) && "active"
                      )
                    }
                  >
                    <link.icon size={19} className="flex-shrink-0" />
                    {!collapsed && <p>{link.label}</p>}

                    {link.subMenu && !collapsed && (
                      <svg
                        className={cn(
                          "ml-auto h-3 w-3 transform transition-transform",
                          openSubMenu === link.path ? "rotate-90" : "rotate-0"
                        )}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </NavLink>

                  {link.subMenu &&
                    openSubMenu === link.path &&
                    !collapsed &&
                    renderSubMenu(link.subMenu, link.path)}
                </div>
              );
            })}
          </nav>
        ))}
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};

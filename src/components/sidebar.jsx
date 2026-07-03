import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiAward,
  FiCalendar,
  FiMail,
  FiMenu,
  FiX,
  FiFileText,
  FiDownload,
  FiClipboard,

} from "react-icons/fi";
import { useState, useEffect } from "react";

import logo from "../assets/logo.png";

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const menus = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FiGrid />,
    },
    {
      name: "Speakers",
      path: "/speakers",
      icon: <FiUsers />,
    },
    {
      name: "Sponsors",
      path: "/sponsors",
      icon: <FiAward />,
    },
    {
      name: "Agenda",
      path: "/agenda",
      icon: <FiCalendar />,
    },
    {
      name: "Contacts",
      path: "/contacts",
      icon: <FiMail />,
    },
    {
      name: "Booth Bookings",
      path: "/booth-bookings",
      icon: <FiClipboard />,
    },
    {
      name: "Blogs",
      path: "/Blogs",
      icon: <FiUsers />,
    },
    {
      name: "Brochure",
      path: "/brochure-downloads",
      icon: <FiDownload />,
    },

{
  name: "Registrations",
  path: "/registrations",
  icon: <FiClipboard />,
}
  ];

  // Mobile toggle button
  const MobileToggle = () => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 md:hidden transition-all duration-300 hover:shadow-xl"
      aria-label="Toggle Sidebar"
    >
      {isOpen ? (
        <FiX className="text-2xl text-orange-500" />
      ) : (
        <FiMenu className="text-2xl text-orange-500" />
      )}
    </button>
  );

  // Overlay for mobile
  const Overlay = () => (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-30 md:hidden
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={() => setIsOpen(false)}
    />
  );

  return (
    <>
      <MobileToggle />
      <Overlay />

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen
        w-72 min-h-screen bg-white border-r border-gray-100
          transition-all duration-300 ease-in-out transform
          z-40 shadow-2xl md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-100 bg-white">
          <div className="flex items-center">
            <img
              src={logo}
              alt="REPAX Logo"
              className="w-38 h-auto object-contain"
            />
          </div>
        </div>

        {/* Menu */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-200px)]">
          <div className="space-y-1.5">
            {menus.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <Link
                  key={menu.path}
                  to={menu.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200 group relative
                    ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 scale-[1.02]"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-500 hover:scale-[1.02] hover:shadow-md"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></span>
                  )}

                  <span
                    className={`text-lg transition-transform duration-200 group-hover:scale-110 ${isActive ? "scale-110" : ""}`}
                  >
                    {menu.icon}
                  </span>
                  <span className="font-medium">{menu.name}</span>

                  {/* Hover tooltip for mobile */}
                  {isActive && (
                    <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="w-2 h-12 bg-orange-500 rounded-full"></div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">
                  REPAX INDIA 2026
                </h3>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  Renewable Energy Summit
                </p>
                <div className="flex items-center gap-2 mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

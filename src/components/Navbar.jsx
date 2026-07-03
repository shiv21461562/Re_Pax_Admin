import { useState, useEffect, useRef } from "react";
import {
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
  FiChevronDown,
  FiSearch,
  FiMenu,
  FiHelpCircle,
} from "react-icons/fi";

function Navbar({ toggleSidebar, isSidebarOpen, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dropdownRef = useRef(null);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear all storage
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isLoggedIn");
    
    // Close dropdown
    setIsDropdownOpen(false);
    
    // Call parent logout function if provided
    if (onLogout) {
      onLogout();
    } else {
      // Fallback: redirect to login
      window.location.href = "/login";
    }
  };

  return (
    <nav className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
              aria-label="Toggle Sidebar"
            >
              <FiMenu className="text-xl" />
            </button>
          )}

          <div>
            <h2 className="text-gray-800 font-semibold text-base md:text-lg">
              Admin Dashboard
            </h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search - Desktop */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200 focus-within:border-orange-300 transition-all duration-200">
            <FiSearch className="text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-gray-700 text-sm px-2 py-1 outline-none w-32 lg:w-48 placeholder-gray-400"
            />
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 md:gap-3 p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200"
              aria-label="User menu"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>

              {/* User Info */}
              <div className="hidden md:block text-left">
                <p className="text-gray-800 text-sm font-medium leading-tight">
                  Admin User
                </p>
                <p className="text-gray-400 text-xs">admin@repax.com</p>
              </div>

              <FiChevronDown
                className={`text-gray-400 text-sm transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 overflow-hidden">
                {/* User Info - Mobile */}
                <div className="md:hidden px-4 py-3 border-b border-gray-100">
                  <p className="text-gray-800 text-sm font-medium">
                    Admin User
                  </p>
                  <p className="text-gray-400 text-xs">admin@repax.com</p>
                </div>

                {/* Profile */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    console.log("Profile clicked");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200"
                >
                  <FiUser className="text-sm" />
                  <span className="text-sm">Profile</span>
                </button>

                {/* Settings */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    console.log("Settings clicked");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200"
                >
                  <FiSettings className="text-sm" />
                  <span className="text-sm">Settings</span>
                </button>

                {/* Help */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    console.log("Help clicked");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200"
                >
                  <FiHelpCircle className="text-sm" />
                  <span className="text-sm">Help</span>
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                {/* Logout - Inside Dropdown */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <FiLogOut className="text-sm" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
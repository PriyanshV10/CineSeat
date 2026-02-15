import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCity } from "../../context/CityContext";
import ThemeToggle from "../ThemeToggle";

const Navbar = () => {
  const { user, logout, isTheater } = useAuth();
  const { selectedCity, setSelectedCity } = useCity();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const cityRef = useRef(null);
  const profileRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setCityDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cities = [
    { id: 1, name: "Mumbai" },
    { id: 2, name: "Delhi-NCR" },
    { id: 3, name: "Bengaluru" },
    { id: 4, name: "Hyderabad" },
    { id: 5, name: "Ahmedabad" },
    { id: 6, name: "Chandigarh" },
    { id: 7, name: "Chennai" },
    { id: 8, name: "Pune" },
    { id: 9, name: "Kolkata" },
    { id: 10, name: "Kochi" },
  ];

  return (
    <header className="bg-white dark:bg-[#1A1A1A] shadow-sm transition-colors duration-300 relative z-50">
      {/* Top Navbar */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-6 flex-1">
          <Link to="/" className="flex flex-col select-none">
            <span className="text-2xl font-black tracking-tighter text-red-600 leading-none">
              cine<span className="text-black dark:text-white">seat</span>
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl hidden md:block"
          >
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                className="w-full py-2 pl-10 pr-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-red-500 dark:bg-[#2C2C2C] dark:border-gray-600 dark:text-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Admin / Theater Dashboard Link - Desktop */}
        {isTheater && (
          <div className="hidden md:flex ml-4">
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold shadow-md hover:bg-red-700 transition-all"
            >
              Theater Dashboard
            </Link>
          </div>
        )}

        {/* Right: City, Auth, Theme */}
        <div className="flex items-center gap-6">
          {/* City Selector */}
          <div className="relative" ref={cityRef}>
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
            >
              {selectedCity ? selectedCity.name : "Select City"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-4 h-4 transition-transform ${cityDropdownOpen ? "rotate-180" : ""}`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* Dropdown */}
            {cityDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#2C2C2C] rounded-md shadow-xl py-2 z-50 border border-gray-100 dark:border-gray-700 max-h-64 overflow-y-auto">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user?.avatarUrl}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-white hidden sm:block">
                    {user.name}
                  </span>
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#2C2C2C] rounded-md shadow-xl py-2 z-50 border border-gray-100 dark:border-gray-700">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Bookings
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                    {isTheater && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-red-600 font-bold border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Theater Dashboard
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-1.5 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCity } from "../../context/CityContext";
import ThemeToggle from "../ThemeToggle";
import { getCities } from "../../services/api";

const Navbar = () => {
  const { user, logout, isTheater, isAdmin } = useAuth();
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

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchNavbarCities = async () => {
      try {
        const data = await getCities();
        setCities(data);
      } catch (error) {
        console.error("Failed to fetch cities for navbar", error);
      }
    };
    fetchNavbarCities();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 glass z-50 transition-colors duration-500 rounded-b-2xl mx-auto max-w-[98%] mt-2 shadow-2xl">
      {/* Top Navbar */}
      <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-8 flex-1">
          <Link to="/" className="flex flex-col select-none group">
            <span className="text-2xl font-black tracking-tighter text-primary leading-none transition-transform group-hover:scale-105">
              cine<span className="text-foreground">seat</span>
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl hidden md:block"
          >
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground transition-colors group-focus-within:text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
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
                className="w-full py-2.5 pl-12 pr-4 bg-black/5 dark:bg-white/10 border border-transparent focus:border-primary/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-all duration-300 placeholder:text-muted-foreground shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Admin / Theater Dashboard Link - Desktop */}
        {(isAdmin || isTheater) && (
          <div className="hidden md:flex ml-4">
            <Link
              to="/admin/dashboard"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white text-sm font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all"
            >
              {isAdmin ? "Admin Portal" : "Partner Portal"}
            </Link>
          </div>
        )}

        {/* Right: City, Auth, Theme */}
        <div className="flex items-center gap-6">
          {/* City Selector */}
          <div className="relative" ref={cityRef}>
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              {selectedCity ? selectedCity.name : "Select City"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-4 h-4 transition-transform duration-300 ${cityDropdownOpen ? "rotate-180 text-primary" : ""}`}
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
              <div className="absolute right-0 top-full mt-4 w-56 glass rounded-xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto animate-fade-in-up origin-top-right">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className="block w-full text-left px-5 py-2.5 text-sm font-medium text-foreground hover:bg-primary hover:text-white transition-colors"
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user?.avatarUrl}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-bold text-foreground hidden sm:block">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-4 w-56 glass rounded-xl shadow-2xl py-2 z-50 animate-fade-in-up origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 mb-2">
                      <p className="text-sm font-bold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-5 py-2.5 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      to="/bookings"
                      className="block px-5 py-2.5 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    
                    {(isAdmin || isTheater) && (
                      <Link
                        to="/admin/dashboard"
                        className="block md:hidden px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/10 transition-colors border-t border-gray-100 dark:border-white/5 mt-2"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        {isAdmin ? "Admin Portal" : "Partner Portal"}
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="block w-full text-left px-5 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors border-t border-gray-100 dark:border-white/5 mt-2"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary py-2 px-5 text-sm"
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

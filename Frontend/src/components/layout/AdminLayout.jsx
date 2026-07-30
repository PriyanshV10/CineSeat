import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";

const AdminLayout = () => {
  const { user, logout, isAdmin, isTheater } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminLinks = [
    { name: "Overview", path: "/admin/dashboard", icon: "📊" },
    { name: "Movies", path: "/admin/movies", icon: "🎬" },
    { name: "Theaters", path: "/admin/theaters", icon: "🏢" },
    { name: "Users", path: "/admin/users", icon: "👥" },
  ];

  const theaterLinks = [
    { name: "Overview", path: "/admin/dashboard", icon: "📊" },
    { name: "Theaters", path: "/admin/theaters", icon: "🏢" },
    { name: "Shows", path: "/admin/shows", icon: "🎫" },
  ];

  const links = isAdmin ? adminLinks : isTheater ? theaterLinks : [];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-500">
      {/* Mobile Header */}
      <div className="md:hidden glass flex items-center justify-between p-4 z-40 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <span className="font-bold text-lg text-foreground">
            {isAdmin ? "Admin Portal" : "Partner Portal"}
          </span>
        </div>
        <ThemeToggle />
      </div>

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 w-64 glass-card rounded-none border-t-0 border-b-0 border-l-0
        flex flex-col transition-transform duration-300 ease-in-out
      `}>
        <div className="p-6 hidden md:flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter text-primary">
            cine<span className="text-foreground">seat</span>
          </Link>
          <ThemeToggle />
        </div>
        
        <div className="px-6 py-4 md:py-0 mb-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            {isAdmin ? "Admin Controls" : "Theater Controls"}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive 
                    ? "bg-primary text-white shadow-glow-sm" 
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden h-screen">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar">
          <div className="max-w-6xl mx-auto animate-fade-in-up">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

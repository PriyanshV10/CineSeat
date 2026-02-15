import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OAuthCallback from "./pages/OAuthCallback";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import TheaterListing from "./pages/TheaterListing";
import Layout from "./components/layout/Layout";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import BookingSuccess from "./pages/BookingSuccess";
import UserBookings from "./pages/UserBookings";

import AdminDashboard from "./pages/admin/AdminDashboard";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121212] text-black dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0) {
    const hasRole = allowedRoles.some((role) => user.role === role);
    if (!hasRole) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

const PublicRoute = ({ children, restricted = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121212] text-black dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (restricted && user) {
    return <Navigate to="/" />;
  }

  return children;
};


function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/buy/movies/:id" element={<TheaterListing />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute restricted>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute restricted>
              <Signup />
            </PublicRoute>
          }
        />

        {/* User Protected Routes */}
        <Route
          path="/book/show/:id"
          element={
            <ProtectedRoute>
              <SeatSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/success"
          element={
            <ProtectedRoute>
              <BookingSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <UserBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="text-gray-900 dark:text-white text-center py-20">
                Profile Page (Coming Soon)
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin/Partner Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "THEATER"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "THEATER"]}>
              <Navigate to="/admin/dashboard" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;

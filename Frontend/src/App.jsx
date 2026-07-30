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
import Profile from "./pages/Profile";

import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminTheaters from "./pages/admin/AdminTheaters";
import TheaterShows from "./pages/admin/TheaterShows";
import AdminUsers from "./pages/admin/AdminUsers";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121212] text-black dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0) {
    const hasRole = allowedRoles.some((role) => user.role && user.role.includes(role));
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
    <Routes>
      {/* Regular App Routes with Standard Layout */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/search" element={<Layout><SearchPage /></Layout>} />
      <Route path="/movies/:id" element={<Layout><MovieDetails /></Layout>} />
      <Route path="/buy/movies/:id" element={<Layout><TheaterListing /></Layout>} />
      <Route path="/oauth/callback" element={<Layout><OAuthCallback /></Layout>} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute restricted>
            <Layout><Login /></Layout>
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute restricted>
            <Layout><Signup /></Layout>
          </PublicRoute>
        }
      />

      {/* User Protected Routes */}
      <Route
        path="/book/show/:id"
        element={
          <ProtectedRoute>
            <Layout><SeatSelection /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/success"
        element={
          <ProtectedRoute>
            <Layout><BookingSuccess /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <Layout><UserBookings /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin/Partner Routes with Admin Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "THEATER"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="movies" element={<AdminMovies />} />
        <Route path="theaters" element={<AdminTheaters />} />
        <Route path="shows" element={<TheaterShows />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;

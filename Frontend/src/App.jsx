import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OAuthCallback from "./pages/OAuthCallback";
import { useAuth } from "./context/AuthContext";
import ThemeToggle from "./components/ThemeToggle";
import Home from "./pages/Home";

const Home1 = () => {
  const { logout, user } = useAuth();
  console.log(user);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-10 rounded-2xl shadow-2xl text-center transition-all duration-300 hover:shadow-violet-500/10">
        <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome, {user?.sub}!
        </h1>
        <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
          You are successfully logged in.
        </p>
        <button
          onClick={logout}
          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return user ? <Navigate to="/" /> : children;
};
function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default App;

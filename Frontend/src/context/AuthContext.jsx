import React, { createContext, useState, useEffect, useContext } from "react";
import api, { getUserProfile } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setUser(response);
    } catch (error) {
      clearLocalAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const clearLocalAuth = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const logout = async () => {
    if (user?.id) {
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.error("Logout API failed", error);
      }
    }
    clearLocalAuth();
  };

  const isAdmin = user?.role?.includes("ADMIN");
  const isTheater = user?.role?.includes("THEATER");

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAdmin, isTheater }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

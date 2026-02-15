import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserProfile } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          fetchUserProfile();
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);
  
  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setUser(response);
    } catch (error) {
      logout();
    }
  };

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
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

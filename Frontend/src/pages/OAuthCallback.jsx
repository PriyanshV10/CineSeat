import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      login(token);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, login]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="text-xl font-medium text-zinc-900 dark:text-white animate-pulse">
        Processing Login...
      </div>
    </div>
  );
};
export default OAuthCallback;

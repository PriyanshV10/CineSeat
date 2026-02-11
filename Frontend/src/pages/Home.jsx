import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import defaultAvatar from "../assets/user-avatar.png";

const Home = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await api.get("/users/me");
      const fetchedUser = response.data;
      setUser(fetchedUser);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <div className="flex justify-between">
        <img
          src={user?.avatarUrl || defaultAvatar}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />

        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
export default Home;

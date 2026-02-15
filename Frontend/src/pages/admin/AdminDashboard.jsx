import React from "react";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow p-6">
        <p className="text-gray-700 dark:text-gray-300">
          Welcome to the Partner/Admin Portal. Manage your movies, theaters, and
          shows here.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;

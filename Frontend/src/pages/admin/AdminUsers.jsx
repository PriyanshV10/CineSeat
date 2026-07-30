import React, { useState, useEffect } from "react";
import { getAdminUsers, updateUserRole } from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpgradeToTheater = async (id) => {
    try {
      await updateUserRole(id, "THEATER");
      fetchUsers();
    } catch (error) {
      console.error("Failed to upgrade user", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions.</p>
        </div>
      </div>

      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-muted-foreground">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-4 font-medium text-foreground">{user.name}</td>
                    <td className="py-4 text-muted-foreground">{user.email}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' :
                        user.role === 'THEATER' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {user.role === 'USER' && (
                        <button 
                          onClick={() => handleUpgradeToTheater(user.id)}
                          className="text-primary hover:underline text-xs font-bold"
                        >
                          Upgrade to Theater
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

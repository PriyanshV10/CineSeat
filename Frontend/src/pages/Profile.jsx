import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground tracking-tight">Profile Settings</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <div className="glass-card flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-3xl shadow-xl mb-4 border-4 border-background">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {user.role?.split(',').map(role => (
                  <span key={role} className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md uppercase tracking-wider">
                    {role.trim()}
                  </span>
                ))}
              </div>
              <button onClick={logout} className="btn-outline w-full text-destructive hover:bg-destructive/10 border-destructive/20">
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card">
              <h3 className="text-xl font-bold text-foreground mb-6">Personal Information</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <input type="text" defaultValue={user.name} disabled className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none opacity-70 cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none opacity-70 cursor-not-allowed" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <input type="tel" placeholder="Add phone number" className="w-full px-4 py-2 bg-transparent border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div className="pt-4">
                  <button type="button" className="btn-primary">Save Changes</button>
                </div>
              </form>
            </div>

            <div className="glass-card">
              <h3 className="text-xl font-bold text-foreground mb-6">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive booking confirmations and offers</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">SMS Alerts</p>
                    <p className="text-sm text-muted-foreground">Get showtime reminders on your phone</p>
                  </div>
                  <div className="w-12 h-6 bg-muted-foreground/30 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

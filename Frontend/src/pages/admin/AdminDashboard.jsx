import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAdminTheaters, getTheaterShows, getAdminMovies, getAdminUsers } from "../../services/api";

const AdminDashboard = () => {
  const { user, isAdmin, isTheater } = useAuth();
  const [stats, setStats] = useState({ movies: 0, theaters: 0, users: 0, shows: 0 });
  const [recentTheaters, setRecentTheaters] = useState([]);
  const [recentShows, setRecentShows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchSafe = async (promise) => {
          try {
            const res = await promise;
            return Array.isArray(res) ? res : (res?.content && Array.isArray(res.content) ? res.content : []);
          } catch (err) {
            console.error("Dashboard fetch error:", err);
            return [];
          }
        };

        const theatersRaw = await fetchSafe(getAdminTheaters());
        const theaters = isTheater && !isAdmin && user ? theatersRaw.filter(t => t.owner?.id === user.id) : theatersRaw;
        
        const showsRaw = await fetchSafe(getTheaterShows());
        const shows = isTheater && !isAdmin && user 
           ? showsRaw.filter(s => s.screen?.theater?.owner?.id === user.id)
           : showsRaw;
           
        const movies = isAdmin ? await fetchSafe(getAdminMovies()) : [];
        const usersData = isAdmin ? await fetchSafe(getAdminUsers()) : [];

        setRecentTheaters(theaters.slice(0, 5));
        setRecentShows(shows.slice(0, 5));
        
        setStats({
          movies: movies.length,
          theaters: theaters.length,
          users: usersData.length,
          shows: shows.length
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchData();
  }, [isAdmin]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground">Here's what's happening with your {isAdmin ? "platform" : "theaters"} today.</p>
        </div>
        <div className="hidden sm:block">
          <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg uppercase tracking-wider">
            {isAdmin ? "Admin" : "Theater"} Portal
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {(isAdmin ? [
          { label: "Total Movies", value: stats.movies, change: "Catalog", trend: "up" },
          { label: "Total Theaters", value: stats.theaters, change: "Partners", trend: "up" },
          { label: "Registered Users", value: stats.users, change: "Platform", trend: "up" },
          { label: "Total Shows", value: stats.shows, change: "Active", trend: "up" },
        ] : [
          { label: "Total Shows", value: stats.shows, change: "Active", trend: "up" },
          { label: "Total Theaters", value: stats.theaters, change: "Your Locations", trend: "up" },
        ]).map((stat, i) => (
          <div key={i} className="glass-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-foreground">{stat.value}</span>
              <span className="text-sm font-bold text-primary">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card border-dashed">
          <h3 className="text-lg font-bold text-foreground mb-4">Recent Theaters</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">City</th>
                  <th className="pb-3 font-medium">Address</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentTheaters.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-muted-foreground">No theaters available.</td>
                  </tr>
                ) : (
                  recentTheaters.map(theater => (
                    <tr key={theater.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="py-3 font-medium text-foreground">{theater.name}</td>
                      <td className="py-3 text-muted-foreground">{theater.city?.name || "N/A"}</td>
                      <td className="py-3 text-muted-foreground">{theater.address}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="glass-card">
          <h3 className="text-lg font-bold text-foreground mb-4">Recent Shows</h3>
          <div className="space-y-4">
            {recentShows.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No shows scheduled.</p>
            ) : (
              recentShows.map((show) => (
                <div key={show.id} className="flex gap-4 items-start p-3 bg-muted/20 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs">🎟️</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{show.movie?.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(show.startTime).toLocaleString()} • {show.screen?.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

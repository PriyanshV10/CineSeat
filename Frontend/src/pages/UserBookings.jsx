import React, { useEffect, useState } from "react";
import { getUserBookings } from "../services/api.js";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getUserBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const upcomingBookings = bookings.filter(b => new Date(b.showTime) >= new Date());
  const pastBookings = bookings.filter(b => new Date(b.showTime) < new Date());

  const displayedBookings = activeTab === "upcoming" ? upcomingBookings : pastBookings;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pt-24 pb-12 px-4 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
            My Bookings
          </h1>
          <p className="text-muted-foreground">View and manage your ticket history</p>
        </div>
        
        {/* Tabs */}
        <div className="flex p-1 bg-muted/50 rounded-lg w-fit border border-border">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "upcoming" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "past" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {displayedBookings.length === 0 ? (
        <div className="text-center py-20 glass-card border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl opacity-50">🎟️</span>
          </div>
          <p className="text-foreground font-medium mb-2">No {activeTab} bookings found</p>
          <p className="text-muted-foreground text-sm">
            {activeTab === "upcoming" 
              ? "When you book tickets, they will appear here." 
              : "You haven't watched any movies yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {displayedBookings.map((booking) => (
            <div
              key={booking.id}
              className="glass-card flex p-0 overflow-hidden group hover:scale-[1.02]"
            >
              <div className="w-1/3 aspect-[2/3] relative">
                <img
                  src={booking.moviePoster || "https://placehold.co/150x225?text=No+Poster"}
                  alt={booking.movieTitle}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { e.target.src = "https://placehold.co/150x225?text=No+Image"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              
              <div className="w-2/3 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-foreground truncate max-w-[80%] text-glow">
                      {booking.movieTitle}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                      booking.status === "CONFIRMED" ? "bg-green-500/20 text-green-500 border border-green-500/30" :
                      booking.status === "PENDING" ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" :
                      "bg-red-500/20 text-red-500 border border-red-500/30"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    {booking.screen}
                  </p>

                  <div className="space-y-2 bg-muted/30 p-3 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Date</span>
                      <span className="text-foreground font-bold">{new Date(booking.showTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Time</span>
                      <span className="text-foreground font-bold">{new Date(booking.showTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Seats</span>
                      <span className="text-primary font-bold">{booking.seats}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Booking ID: <span className="font-mono text-foreground">{booking.id}</span></span>
                  <button className="text-primary font-bold hover:underline">View Ticket</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;

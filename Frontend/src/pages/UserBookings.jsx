import React, { useEffect, useState } from "react";
import { getUserBookings } from "../services/api.js";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 tracking-tight">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20 border border-zinc-300 dark:border-zinc-800 rounded-lg border-dashed">
          <p className="text-zinc-600 dark:text-zinc-500">
            You haven't booked any tickets yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors group shadow-sm dark:shadow-none"
            >
              <div className="flex">
                <div className="w-1/3 aspect-[2/3]">
                  <img
                    src={
                      booking.moviePoster ||
                      "https://placehold.co/150x225?text=No+Poster"
                    }
                    alt={booking.movieTitle}
                    className="h-full w-full object-cover grayscale opacity-100 dark:opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/150x225?text=No+Image";
                    }}
                  />
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1 truncate">
                      {booking.movieTitle}
                    </h3>
                    <p className="text-xs text-zinc-500 mb-2">
                      {booking.screen}
                    </p>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="w-12 text-zinc-500 dark:text-zinc-600">
                          Date
                        </span>
                        <span>
                          {new Date(booking.showTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="w-12 text-zinc-500 dark:text-zinc-600">
                          Time
                        </span>
                        <span>
                          {new Date(booking.showTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">
                        Seats:{" "}
                        <span className="text-zinc-800 dark:text-zinc-300 font-medium">
                          {booking.seats}
                        </span>
                      </span>
                      <span className="bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                        {booking.status}
                      </span>
                    </div>
                  </div>
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

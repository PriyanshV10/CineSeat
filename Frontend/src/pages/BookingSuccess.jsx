import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking) {
      navigate("/");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center shadow-lg shadow-zinc-900/10 dark:shadow-white/10">
            <svg
              className="w-8 h-8 text-white dark:text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Your tickets have been successfully booked.
        </p>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 mb-8 text-left shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-zinc-600 dark:text-zinc-500 text-sm">
              Booking ID
            </span>
            <span className="text-zinc-900 dark:text-white font-mono">
              {booking.id}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-600 dark:text-zinc-500 text-sm">
              Amount Paid
            </span>
            <span className="text-zinc-900 dark:text-white font-medium">
              Rs. {booking.totalPrice}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/bookings"
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-medium py-3 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="w-full bg-transparent text-zinc-500 dark:text-zinc-400 font-medium py-3 rounded-lg hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Book Another Movie
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;

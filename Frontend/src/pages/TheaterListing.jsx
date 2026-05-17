import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById, getShows } from "../services/api.js";

const TheaterListing = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let movieData;
        try {
          movieData = await getMovieById(id);
        } catch (e) {
          movieData = {
            title: `Mock Movie ${id}`,
            genres: [{ name: "Action" }],
          };
        }
        setMovie(movieData);

        let showsData;
        try {
          showsData = await getShows(id, null, selectedDate);
        } catch (e) {
          console.warn("API failed, using mock data for shows");
          // Mock Shows
          showsData = [
            {
              id: 101,
              startTime: new Date().setHours(10, 0, 0, 0),
              theater: {
                id: 1,
                name: "PVR: Phoenix Marketcity",
                address: "Kurla",
              },
              screen: { name: "Audi 1" },
            },
            {
              id: 102,
              startTime: new Date().setHours(13, 0, 0, 0),
              theater: {
                id: 1,
                name: "PVR: Phoenix Marketcity",
                address: "Kurla",
              },
              screen: { name: "Audi 1" },
            },
            {
              id: 103,
              startTime: new Date().setHours(11, 30, 0, 0),
              theater: {
                id: 2,
                name: "Cinepolis: Fun Republic",
                address: "Andheri",
              },
              screen: { name: "Screen 2" },
            },
          ];
        }
        setShows(showsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, selectedDate]);

  // Generate next 3 days
  const dates = [...Array(3)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  if (loading)
    return <div className="text-center py-20 dark:text-white">Loading...</div>;

  const showsByTheater = shows.reduce((acc, show) => {
    const theaterId = show.theater.id;
    if (!acc[theaterId]) {
      acc[theaterId] = { theater: show.theater, shows: [] };
    }
    acc[theaterId].shows.push(show);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-white pb-20">
      {/* Header */}
      <div className="bg-[#333545] text-white py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-light">{movie?.title}</h1>
          <div className="flex gap-2 text-sm mt-2 items-center text-gray-300">
            <span className="border border-gray-500 px-1 text-xs">UA</span>
            <span>{movie?.genres?.map((g) => g.name).join(", ")}</span>
          </div>
        </div>
      </div>

      {/* Date Selector sticky */}
      <div className="sticky top-0 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 overflow-x-auto py-2">
            {dates.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center min-w-[50px] px-2 py-2 rounded transition-colors ${
                  selectedDate.toDateString() === date.toDateString()
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                <span className="text-xs uppercase">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="text-lg font-bold">{date.getDate()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters (Placeholder) */}
      <div className="bg-gray-100 dark:bg-[#1A1A1A] py-2 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 flex gap-4 text-xs overflow-x-auto">
          <select className="bg-transparent dark:text-white outline-none">
            <option>Filter: Price</option>
          </select>
          <select className="bg-transparent dark:text-white outline-none">
            <option>Filter: Show Selection</option>
          </select>
        </div>
      </div>

      {/* Theater List */}
      <div className="container mx-auto px-4 mt-6">
        {Object.keys(showsByTheater).length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No shows available for this date.
          </div>
        ) : (
          Object.entries(showsByTheater).map(
            ([theaterId, { theater, shows }]) => (
              <div
                key={theaterId}
                className="bg-white dark:bg-transparent border-b border-gray-200 dark:border-gray-800 py-6 flex flex-col md:flex-row gap-4"
              >
                <div className="md:w-1/3">
                  <h3 className="font-bold hover:underline cursor-pointer flex items-center gap-2">
                    {theater.name}
                    <span className="text-xs font-normal text-green-500 border border-green-500 px-1 rounded">
                      M-Ticket
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Non-Cancellable</p>
                </div>

                <div className="flex-1 flex flex-wrap gap-4 items-center">
                  {shows.map((show) => (
                    <Link
                      key={show.id}
                      to={`/book/show/${show.id}`}
                      className="group border border-gray-300 dark:border-gray-600 rounded px-6 py-2 hover:bg-white dark:hover:bg-[#121212] transition-all text-center min-w-[100px] relative overflow-hidden"
                    >
                      <div className="text-sm font-medium text-green-500">
                        {new Date(show.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                        {show.screen.name}
                      </div>

                      {/* Popover on hover could show price */}
                    </Link>
                  ))}
                </div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
};

export default TheaterListing;

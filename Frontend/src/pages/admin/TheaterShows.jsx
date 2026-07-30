import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getTheaterShows, getAdminMovies, getAdminTheaters, getScreens, createShow } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const TheaterShows = () => {
  const { user, isAdmin, isTheater } = useAuth();
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ 
    movieId: "", 
    theaterId: "",
    screenId: "", 
    startTime: "", 
    price: "" 
  });

  const fetchShows = async () => {
    try {
      const data = await getTheaterShows();
      if (isTheater && !isAdmin && user) {
        setShows(data.filter(s => s.screen?.theater?.owner?.id === user.id));
      } else {
        setShows(data);
      }
    } catch (error) {
      console.error("Failed to fetch shows", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [moviesData, theatersData] = await Promise.all([
          getAdminMovies(),
          getAdminTheaters()
        ]);
        setMovies(moviesData);
        if (isTheater && !isAdmin && user) {
          setTheaters(theatersData.filter(t => t.owner?.id === user.id));
        } else {
          setTheaters(theatersData);
        }
      } catch (error) {
        console.error("Failed to fetch dependencies", error);
      }
    };
    fetchDependencies();
    fetchShows();
  }, []);

  const handleTheaterChange = async (e) => {
    const theaterId = e.target.value;
    setFormData({ ...formData, theaterId, screenId: "" });
    if (theaterId) {
      try {
        const screensData = await getScreens(theaterId);
        setScreens(screensData);
      } catch (error) {
        console.error("Failed to fetch screens", error);
      }
    } else {
      setScreens([]);
    }
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      let timeString = formData.startTime;
      if (timeString.length === 16) {
        timeString += ":00";
      }

      await createShow({
        movieId: Number(formData.movieId),
        screenId: Number(formData.screenId),
        startTime: timeString,
        price: parseFloat(formData.price)
      });
      setIsModalOpen(false);
      setFormData({ movieId: "", theaterId: "", screenId: "", startTime: "", price: "" });
      fetchShows();
    } catch (error) {
      console.error("Failed to schedule show", error.response?.data || error);
      alert(error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : "Failed to schedule show"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Show Management</h1>
          <p className="text-muted-foreground">Schedule and manage movie shows for your screens.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <span>+</span> Schedule Show
        </button>
      </div>

      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Movie</th>
                <th className="pb-3 font-medium">Screen</th>
                <th className="pb-3 font-medium">Start Time</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-muted-foreground">Loading shows...</td>
                </tr>
              ) : shows.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">No shows scheduled.</td>
                </tr>
              ) : (
                shows.map(show => (
                  <tr key={show.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-4 font-medium text-foreground">{show.movie?.title}</td>
                    <td className="py-4 text-muted-foreground">{show.screen?.name}</td>
                    <td className="py-4 text-muted-foreground">{new Date(show.startTime).toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <button className="text-primary hover:underline text-xs font-bold mr-3">Edit</button>
                      <button className="text-destructive hover:underline text-xs font-bold">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Show Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Schedule New Show</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateShow} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Movie</label>
                <select 
                  required
                  value={formData.movieId}
                  onChange={(e) => setFormData({...formData, movieId: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                >
                  <option value="">Select a movie</option>
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Theater</label>
                <select 
                  required
                  value={formData.theaterId}
                  onChange={handleTheaterChange}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                >
                  <option value="">Select a theater</option>
                  {theaters.map(theater => (
                    <option key={theater.id} value={theater.id}>{theater.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Screen</label>
                <select 
                  required
                  value={formData.screenId}
                  onChange={(e) => setFormData({...formData, screenId: e.target.value})}
                  disabled={!formData.theaterId || screens.length === 0}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                >
                  <option value="">Select a screen</option>
                  {screens.map(screen => (
                    <option key={screen.id} value={screen.id}>{screen.name}</option>
                  ))}
                </select>
                {formData.theaterId && screens.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">This theater has no screens. Please add a screen in the Theaters page first.</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Start Time</label>
                <input 
                  type="datetime-local" 
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Price</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!formData.screenId}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Schedule Show
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TheaterShows;

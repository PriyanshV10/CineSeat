import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getAdminMovies, createMovie } from "../../services/api";

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    language: "",
    posterUrl: ""
  });

  const fetchMovies = async () => {
    try {
      const data = await getAdminMovies();
      setMovies(data);
    } catch (error) {
      console.error("Failed to fetch movies", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      await createMovie({
        ...formData,
        duration: parseInt(formData.duration),
        genreIds: [],
        castIds: []
      });
      setIsModalOpen(false);
      setFormData({ title: "", description: "", duration: "", language: "", posterUrl: "" });
      fetchMovies();
    } catch (error) {
      console.error("Failed to create movie", error);
      alert("Failed to create movie");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Movie Management</h1>
          <p className="text-muted-foreground">Add, edit, or remove movies from the catalog.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <span>+</span> Add Movie
        </button>
      </div>

      <div className="glass-card">
        <div className="flex justify-between items-center mb-4">
          <input 
            type="text" 
            placeholder="Search movies..." 
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm w-64 focus:outline-none focus:border-primary"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Movie Title</th>
                <th className="pb-3 font-medium">Language</th>
                <th className="pb-3 font-medium">Duration</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-muted-foreground">Loading movies...</td>
                </tr>
              ) : movies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">No movies found. Add one to get started.</td>
                </tr>
              ) : (
                movies.map(movie => (
                  <tr key={movie.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-4 font-medium text-foreground">{movie.title}</td>
                    <td className="py-4 text-muted-foreground">{movie.language}</td>
                    <td className="py-4 text-muted-foreground">{movie.duration}m</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-bold">{movie.status || "UNKNOWN"}</span>
                    </td>
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

      {/* Create Movie Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Add New Movie</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateMovie} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Movie Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Description</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Duration (mins)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Language</label>
                  <input 
                    type="text" 
                    required
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Poster URL</label>
                <input 
                  type="url"
                  placeholder="https://example.com/poster.jpg"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
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
                  className="flex-1 btn-primary"
                >
                  Add Movie
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

export default AdminMovies;

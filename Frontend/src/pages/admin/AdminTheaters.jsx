import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getAdminTheaters, getCities, getAdminUsers, createTheater, createScreen, configureSeatLayout, getScreens } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AdminTheaters = () => {
  const { isAdmin, isTheater, user } = useAuth();
  const [theaters, setTheaters] = useState([]);
  const [cities, setCities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", address: "", cityId: "", ownerId: "" });

  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
  const [selectedTheaterId, setSelectedTheaterId] = useState(null);
  const [screenName, setScreenName] = useState("");

  const fetchTheaters = async () => {
    try {
      let data = await getAdminTheaters();
      if (isTheater && !isAdmin && user) {
        data = data.filter(t => t.owner?.id === user.id);
      }
      
      // Fetch screens for each theater to display the count
      const theatersWithCounts = await Promise.all(
        data.map(async (theater) => {
          try {
            const screens = await getScreens(theater.id);
            return { ...theater, screensCount: screens.length };
          } catch (e) {
            return { ...theater, screensCount: 0 };
          }
        })
      );
      
      setTheaters(theatersWithCounts);
    } catch (error) {
      console.error("Failed to fetch theaters", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesData, usersData] = await Promise.all([
          getCities(),
          getAdminUsers()
        ]);
        setCities(citiesData);
        setUsers(usersData.filter(u => u.role === 'THEATER'));
      } catch (error) {
        console.error("Failed to fetch dependencies", error);
      }
    };
    fetchData();
    fetchTheaters();
  }, []);

  const handleCreateTheater = async (e) => {
    e.preventDefault();
    try {
      await createTheater(formData);
      setIsModalOpen(false);
      setFormData({ name: "", address: "", cityId: "", ownerId: "" });
      fetchTheaters();
    } catch (error) {
      console.error("Failed to create theater", error);
      alert("Failed to create theater");
    }
  };

  const handleCreateScreen = async (e) => {
    e.preventDefault();
    if (!selectedTheaterId || !screenName) return;

    try {
      // 1. Create the screen
      const newScreen = await createScreen(selectedTheaterId, { name: screenName });
      
      // 2. Automatically generate a default seat layout (5 rows, 10 seats per row)
      const layoutData = {
        rows: ["A", "B", "C", "D", "E"],
        seatsPerRow: 10,
        aisleColumns: []
      };
      await configureSeatLayout(newScreen.id, layoutData);

      setIsScreenModalOpen(false);
      setScreenName("");
      setSelectedTheaterId(null);
      alert(`Screen "${newScreen.name}" with a default 5x10 layout was created successfully!`);
      // Optionally re-fetch theaters if screens are nested, otherwise we're done
      fetchTheaters();
    } catch (error) {
      console.error("Failed to create screen", error);
      alert("Failed to create screen or layout");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Theater Management</h1>
          <p className="text-muted-foreground">Manage theater partners and their screens.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <span>+</span> Add Theater
          </button>
        )}
      </div>

      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">City</th>
                <th className="pb-3 font-medium">Address</th>
                <th className="pb-3 font-medium">Screens</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-muted-foreground">Loading theaters...</td>
                </tr>
              ) : theaters.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">No theaters found.</td>
                </tr>
              ) : (
                theaters.map(theater => (
                  <tr key={theater.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-4 font-medium text-foreground">{theater.name}</td>
                    <td className="py-4 text-muted-foreground">{theater.city?.name || "N/A"}</td>
                    <td className="py-4 text-muted-foreground">{theater.address}</td>
                    <td className="py-4 text-foreground font-medium">
                      <span className="px-2 py-1 bg-muted/30 rounded-md">
                        {theater.screensCount !== undefined ? theater.screensCount : "-"}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {isTheater && !isAdmin && (
                        <button 
                          onClick={() => {
                            setSelectedTheaterId(theater.id);
                            setIsScreenModalOpen(true);
                          }} 
                          className="text-primary hover:underline text-xs font-bold mr-3"
                        >
                          + Screen
                        </button>
                      )}
                      {isAdmin && (
                        <>
                          <button className="text-primary hover:underline text-xs font-bold mr-3">Edit</button>
                          <button className="text-destructive hover:underline text-xs font-bold">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Theater Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Add New Theater</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateTheater} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Theater Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Address</label>
                <input 
                  type="text" 
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">City</label>
                <select 
                  required
                  value={formData.cityId}
                  onChange={(e) => setFormData({...formData, cityId: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                >
                  <option value="">Select a city</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Assign Owner (Optional)</label>
                <select 
                  value={formData.ownerId}
                  onChange={(e) => setFormData({...formData, ownerId: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                >
                  <option value="">None</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select>
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
                  Add Theater
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Create Screen Modal */}
      {isScreenModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Add Screen</h2>
              <button onClick={() => { setIsScreenModalOpen(false); setScreenName(""); }} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateScreen} className="space-y-4">
              <div className="mb-2 text-sm text-muted-foreground">
                A default seat layout of 5 rows with 10 seats each will be automatically generated.
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Screen Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Screen 1"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsScreenModalOpen(false); setScreenName(""); }}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 btn-primary"
                >
                  Create
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

export default AdminTheaters;

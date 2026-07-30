import React, { useState, useEffect } from "react";
import { getMovies, getTheaters } from "../services/api.js";
import MovieSection from "../components/common/MovieSection";
import Hero from "../components/common/Hero";
import CitySelectionModal from "../components/common/CitySelectionModal";

import { useCity } from "../context/CityContext";

const Home = () => {
  const { selectedCity } = useCity();
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch Recommended (Now Showing)
        const filters = { status: "NOW_SHOWING" };
        const theaterFilters = {};
        
        if (selectedCity?.id) {
          filters.cityId = selectedCity.id;
          theaterFilters.cityId = selectedCity.id;
        }
        
        const [recommendedData, theatersData] = await Promise.all([
          getMovies(filters, 0, 10),
          getTheaters(theaterFilters)
        ]);
        
        setRecommendedMovies(recommendedData.content || []);
        setTheaters(theatersData || []);
      } catch (err) {
        console.error("Failed to fetch home data:", err);
        setRecommendedMovies([]);
        setTheaters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300 pb-20">
      <CitySelectionModal />
      
      {/* Hero Section */}
      {recommendedMovies.length > 0 && <Hero movies={recommendedMovies} />}

      <div className="container mx-auto px-4 mt-8">
        {/* Recommended Movies */}
        {recommendedMovies.length > 0 ? (
          <MovieSection
            title={`Recommended Movies${selectedCity ? ` in ${selectedCity.name}` : ''}`}
            movies={recommendedMovies}
            link="/movies?status=NOW_SHOWING"
          />
        ) : (
          !loading && (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Movies Available</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                There are currently no movies showing in {selectedCity ? selectedCity.name : 'this location'}.
              </p>
            </div>
          )
        )}

        {/* Theaters Section */}
        {theaters.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                Theaters in {selectedCity ? selectedCity.name : 'Your City'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {theaters.map((theater) => (
                <div 
                  key={theater.id} 
                  className="glass p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/20 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {theater.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {theater.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

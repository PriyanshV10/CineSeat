import React, { useState, useEffect } from "react";
import { useCity } from "../../context/CityContext";
import { getCities } from "../../services/api";

const CitySelectionModal = () => {
  const { selectedCity, setSelectedCity } = useCity();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // If there is no selected city in context, open the modal
    if (!selectedCity) {
      setIsOpen(true);
      fetchCities();
    }
  }, [selectedCity]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const data = await getCities();
      setCities(data);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Where are you located?
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Select your city to see movies and events happening near you
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-1">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleSelectCity(city)}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-primary"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-primary text-center">
                  {city.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitySelectionModal;

import React, { useState, useEffect } from "react";
import { getMovies } from "../services/api.js";
import MovieSection from "../components/common/MovieSection";
import Hero from "../components/common/Hero";

const Home = () => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch Recommended (Now Showing)
        let recommendedData = await getMovies({ status: "NOW_SHOWING" }, 0, 10);
        if (!recommendedData.content || recommendedData.content.length === 0) {
          // MOCK DATA for Demo
          recommendedData = {
            content: Array(10)
              .fill(0)
              .map((_, i) => ({
                id: i + 100,
                title: `Recommended Movie ${i + 1}`,
                posterUrl: `https://placehold.co/300x450?text=Movie+${i + 1}`,
                language: "Hindi",
                duration: 120,
                rating: 4.5,
                genres: [{ id: 1, name: "Action" }],
              })),
          };
        }
        setRecommendedMovies(recommendedData.content || []);
      } catch (err) {
        console.error("Failed to fetch home data:", err);
        // Fallback to Mock Data on Error
        setRecommendedMovies(
          Array(10)
            .fill(0)
            .map((_, i) => ({
              id: i + 100,
              title: `Recommended Movie ${i + 1}`,
              posterUrl: `https://placehold.co/300x450?text=Movie+${i + 1}`,
              language: "Hindi",
              duration: 120,
              rating: 4.5,
              genres: [{ id: 1, name: "Action" }],
            })),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300 pb-20">
      {/* Hero Section */}
      <Hero />

      <div className="container mx-auto px-4">
        {/* Recommended Movies */}
        <MovieSection
          title="Recommended Movies"
          movies={recommendedMovies}
          link="/movies?status=NOW_SHOWING"
        />
      </div>
    </div>
  );
};

export default Home;

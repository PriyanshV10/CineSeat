import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchGlobal, getMovies } from "../services/api.js"; // Fallback to getMovies if search api not ready
import MovieCard from "../components/movie/MovieCard";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Try global search first
        try {
          const data = await searchGlobal(query);
          setResults(data.movies || data || []); // Adapt based on actual response structure
        } catch (e) {
          console.warn("Global search failed, falling back to movie filter", e);
          // Fallback: Use getMovies with search filter
          const data = await getMovies({ search: query });
          setResults(data.content || []);
        }
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Search Results for "{query}"
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">
            No results found for "{query}".
          </p>
          <p className="mt-2 text-gray-400">
            Try checking your spelling or use different keywords.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

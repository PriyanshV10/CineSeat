import React from "react";
import MovieCard from "../movie/MovieCard";
import { Link } from "react-router-dom";

const MovieSection = ({ title, movies, link }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        {link && (
          <Link
            to={link}
            className="text-red-500 text-sm font-medium hover:underline"
          >
            See All ›
          </Link>
        )}
      </div>

      <div className="relative">
        {/* Simple Grid for now, can be carousel later */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.slice(0, 5).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieSection;

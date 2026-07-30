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
            className="text-blue-500 text-sm font-medium hover:underline"
          >
            See All ›
          </Link>
        )}
      </div>

      <div className="relative group">
        <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
          {movies.map((movie) => (
            <div key={movie.id} className="w-[160px] md:w-[200px] lg:w-[240px] flex-none snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
        
        {/* Scroll Fades */}
        <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default MovieSection;

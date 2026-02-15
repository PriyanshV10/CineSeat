import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group block mb-4 bg-white dark:bg-white/5 dark:glass-card border border-gray-200 dark:border-transparent rounded-xl p-4 transition-all hover:shadow-lg dark:hover:border-primary/20 shadow-sm"
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted mb-4 relative">
        <img
          src={movie.posterUrl || "https://placehold.co/300x450?text=No+Poster"}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            e.target.src = "https://placehold.co/300x450?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors text-glow">
          {movie.title}
        </h3>

        <div className="flex items-center text-xs text-muted-foreground space-x-2">
          <span>{movie.language}</span>
          <span>•</span>
          <span>{movie.duration}m</span>
          <span>•</span>
          <span className="text-yellow-500">★ {movie.rating || "N/A"}</span>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {movie.genres &&
            movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-muted-foreground border border-gray-200 dark:border-white/10 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5"
              >
                {genre.name}
              </span>
            ))}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;

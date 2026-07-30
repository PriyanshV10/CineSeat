import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no movies provided, use a default cinematic fallback
  const featuredMovies =
    movies.length > 0
      ? movies.slice(0, 3)
      : [
          {
            id: "demo",
            title: "Experience Cinema Like Never Before",
            description:
              "Book your tickets for the latest blockbusters from the comfort of your home. Immersive sound, crystal clear screens, and unforgettable moments await.",
            posterUrl:
              "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          },
        ];

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const currentMovie = featuredMovies[currentIndex];

  return (
    <div className="relative w-full h-[85vh] mb-12 overflow-hidden group">
      {featuredMovies.map((movie, idx) => (
        <div
          key={movie.id + idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] scale-100 group-hover:scale-105"
            style={{ backgroundImage: `url(${movie.posterUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-6 flex flex-col justify-end pb-24 z-20">
            <div className="max-w-3xl animate-fade-in-up">
              {movie.genres && (
                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-md uppercase tracking-widest mb-6 inline-block shadow-glow-sm">
                  {movie.genres.map((g) => g.name).join(", ")}
                </span>
              )}
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl leading-tight">
                {movie.title}
              </h1>
              <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl drop-shadow-md leading-relaxed line-clamp-3">
                {movie.description ||
                  "Immersive sound, crystal clear screens, and unforgettable moments await you at CineSeat."}
              </p>
              <div className="flex gap-4">
                {movie.id !== "demo" ? (
                  <Link to={`/movies/${movie.id}`} className="btn-primary">
                    Book Tickets
                  </Link>
                ) : (
                  <Link to="/search" className="btn-primary">
                    Browse Movies
                  </Link>
                )}
                <button className="btn-outline text-white backdrop-blur-sm">
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Carousel Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {featuredMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-primary shadow-glow-sm"
                  : "w-4 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;

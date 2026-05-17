import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative w-full h-[85vh] mb-8 overflow-hidden group">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center pb-16 z-10">
        <div className="max-w-3xl animate-fade-in-up">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-sm uppercase tracking-wide mb-4 inline-block">
            Cinematic Experience
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg leading-tight">
            Experience Cinema <br /> Like Never Before
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl drop-shadow-md leading-relaxed">
            Book your tickets for the latest blockbusters from the comfort of
            your home. Immersive sound, crystal clear screens, and unforgettable
            moments await.
          </p>
          <div className="flex gap-4">
            <Link
              to="/movies"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-600/30"
            >
              Browse Movies
            </Link>
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-lg border border-white/20 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

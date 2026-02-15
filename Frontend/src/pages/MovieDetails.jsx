import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById, getMovieCast, getMovieReviews } from "../services/api.js";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let movieData;
        try {
          movieData = await getMovieById(id);
        } catch (e) {
          console.warn("API failed, using mock data for movie details");
          movieData = {
            id: id,
            title: `Mock Movie ${id}`,
            posterUrl: "https://placehold.co/300x450?text=Movie+Poster",
            rating: 4.5,
            duration: 120,
            language: "Hindi",
            genres: [{ name: "Action" }, { name: "Thriller" }],
            description:
              "This is a mock description because the backend returned an error or the movie ID is virtual.",
          };
        }
        setMovie(movieData);

        // Mocked or Real data
        const castData = await getMovieCast(id);
        setCast(castData);

        const reviewsData = await getMovieReviews(id);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121212]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!movie) {
    return <div className="text-center py-20 text-white">Movie not found</div>;
  }

  return (
    <div className="bg-white dark:bg-[#1A1A1A] min-h-screen pb-20 transition-colors duration-300">
      {/* Hero Section */}
      <div
        className="relative w-full h-[480px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${movie.posterUrl})`,
          filter: "brightness(0.8)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="container mx-auto px-4 h-full relative z-10 flex items-center">
          <div className="flex flex-col md:flex-row gap-8 items-start w-full">
            {/* Poster */}
            <div className="flex-shrink-0 w-64 rounded-xl overflow-hidden shadow-2xl">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-auto"
              />
              <div className="bg-black text-center py-1 text-white text-xs">
                In Cinemas
              </div>
            </div>

            {/* Info */}
            <div className="text-white flex flex-col gap-4 flex-1">
              <h1 className="text-4xl font-bold">{movie.title}</h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 font-bold text-lg">
                  <span className="text-red-500">♥</span>
                  <span>{movie.rating ? `${movie.rating * 10}%` : "85%"}</span>
                </div>
                <span className="text-gray-400 text-sm">ratings</span>
              </div>

              <div className="flex gap-2">
                <span className="bg-white/20 px-2 py-1 rounded text-xs">
                  2D, 3D
                </span>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">
                  {movie.language}
                </span>
              </div>

              <div className="text-sm text-gray-300 font-medium">
                {movie.duration}m •{" "}
                {movie.genres?.map((g) => g.name).join(", ")} • UA
              </div>

              <Link
                to={`/buy/movies/${movie.id}`}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded w-fit mt-4 transition-colors"
              >
                Book Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-3/4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About the Movie
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            {movie.description || "No description available for this movie."}
          </p>

          <div className="border-t border-gray-200 dark:border-gray-800 my-8"></div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Cast
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {cast.map((actor) => (
              <div key={actor.id} className="flex-shrink-0 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-2 mx-auto">
                  <img
                    src={actor.imageUrl}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                  {actor.name}
                </h3>
                <p className="text-gray-500 text-xs">as {actor.role}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 my-8"></div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Top Reviews
          </h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 dark:bg-[#202020] p-4 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {review.user}
                  </span>
                  <span className="text-yellow-500">★ {review.rating}/5</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

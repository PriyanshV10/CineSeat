import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/v1`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMovies = async (filters = {}, page = 0, size = 10) => {
  // Filter out empty values
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== ""),
  );

  const params = new URLSearchParams({
    page: page,
    size: size,
    ...cleanFilters,
  });

  const response = await api.get(`/movies?${params.toString()}`);
  return response.data;
};

export const getMovieById = async (id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const getShows = async (movieId, cityId, date) => {
  const params = new URLSearchParams();
  if (movieId) params.append("movieId", movieId);
  if (cityId) params.append("cityId", cityId);
  if (date) params.append("date", date.toISOString().split("T")[0]); // Format date as YYYY-MM-DD

  const response = await api.get(`/shows?${params.toString()}`);
  return response.data;
};

export const getShowById = async (id) => {
  const response = await api.get(`/shows/${id}`);
  return response.data;
};

export const getShowSeats = async (showId) => {
  const response = await api.get(`/shows/${showId}/seats`);
  return response.data;
};

export const createBooking = async (bookingRequest) => {
  const response = await api.post("/bookings", bookingRequest);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await api.get("/users/me/bookings");
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const searchGlobal = async (query) => {
  const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const getMovieCast = async (id) => {
  // Mocking for now as backend might not have it
  // const response = await api.get(`/movies/${id}/cast`);
  // return response.data;
  return [
    {
      id: 1,
      name: "Actor 1",
      role: "Protagonist",
      imageUrl: "https://placehold.co/100x100?text=Actor+1",
    },
    {
      id: 2,
      name: "Actor 2",
      role: "Support",
      imageUrl: "https://placehold.co/100x100?text=Actor+2",
    },
    {
      id: 3,
      name: "Actor 3",
      role: "Villain",
      imageUrl: "https://placehold.co/100x100?text=Actor+3",
    },
  ];
};

export const getMovieReviews = async (id) => {
  // Mocking for now
  return [
    { id: 1, user: "User A", rating: 5, comment: "Amazing movie!" },
    { id: 2, user: "User B", rating: 4, comment: "Great visuals." },
  ];
};

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/v1`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // Don't send the Authorization header for auth endpoints (login, register, refresh)
  // because an expired token will cause the backend JwtFilter to crash!
  if (token && !config.url.includes("/auth/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and it's not a retry and not the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token") &&
      !originalRequest.url.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh-token");
        if (res.status === 200) {
          const newToken = res.data.accessToken;
          localStorage.setItem("token", newToken);
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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
  const show = response.data;
  return {
    ...show,
    theater: show.screen?.theater || {},
  };
};

export const getShowSeats = async (showId) => {
  const response = await api.get(`/shows/${showId}/seats`);
  return response.data.map((ss) => {
    const seatNumStr = ss.seat?.seatNumber || "A1";
    // Parse "B7" -> row: "B", number: 7
    const rowMatch = seatNumStr.match(/^[a-zA-Z]+/);
    const numMatch = seatNumStr.match(/\d+$/);
    
    return {
      id: ss.id,
      row: rowMatch ? rowMatch[0].toUpperCase() : "X",
      number: numMatch ? parseInt(numMatch[0], 10) : 0,
      status: ss.status,
      price: ss.price,
    };
  });
};

export const createBooking = async (bookingRequest) => {
  const response = await api.post("/bookings", bookingRequest);
  return response.data;
};

export const confirmBooking = async (bookingId) => {
  const response = await api.post(`/bookings/${bookingId}/confirm`);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await api.get("/bookings/me");
  return response.data.map((b) => ({
    id: b.id,
    movieTitle: b.show?.movie?.title,
    moviePoster: b.show?.movie?.posterUrl,
    screen: b.show?.screen?.name,
    showTime: b.show?.startTime,
    seats: b.seats?.map((s) => `${s.seat?.rowIdentifier}${s.seat?.seatNumber}`).join(", "),
    status: b.status,
  }));
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

// Admin & Partner API
export const getAdminMovies = async () => {
  const response = await api.get('/movies?size=100'); // Assuming pagination, get a bunch
  return response.data.content || response.data;
};

export const createMovie = async (movieData) => {
  const response = await api.post('/admin/movies', movieData);
  return response.data;
};

export const getAdminTheaters = async () => {
  const response = await api.get('/theaters');
  return response.data;
};

export const getTheaters = async (filters) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/theaters?${params.toString()}`);
  return response.data;
};

export const getTheaterShows = async () => {
  const response = await api.get('/shows'); // Maybe need theaterId filter depending on requirements
  return response.data.content || response.data;
};

export const deleteMovie = async (id) => {
  await api.delete(`/admin/movies/${id}`);
};

export const deleteShow = async (id) => {
  await api.delete(`/admin/shows/${id}`);
};

export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.patch(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const createTheater = async (theaterData) => {
  const response = await api.post('/admin/theaters', theaterData);
  return response.data;
};

export const createShow = async (showData) => {
  const response = await api.post('/admin/shows', showData);
  return response.data;
};

export const getCities = async () => {
  const response = await api.get('/cities');
  return response.data;
};

export const getScreens = async (theaterId) => {
  const response = await api.get(`/admin/theaters/${theaterId}/screens`);
  return response.data;
};

export const createScreen = async (theaterId, screenData) => {
  const response = await api.post(`/admin/theaters/${theaterId}/screens`, screenData);
  return response.data;
};

export const configureSeatLayout = async (screenId, layoutData) => {
  const response = await api.post(`/admin/screens/${screenId}/seat-layout`, layoutData);
  return response.data;
};

export default api;

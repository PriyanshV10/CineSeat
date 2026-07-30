package com.cineseat.movie;

import com.cineseat.actor.Actor;
import com.cineseat.actor.ActorRepository;
import com.cineseat.exception.ResourceNotFoundException;
import com.cineseat.genre.Genre;
import com.cineseat.genre.GenreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.PageRequest;
import java.util.ArrayList;
import java.util.List;

@Service
public class MovieService {

  private final MovieRepository movieRepository;
  private final GenreRepository genreRepository;
  private final ActorRepository actorRepository;

  public MovieService(
      MovieRepository movieRepository,
      GenreRepository genreRepository,
      ActorRepository actorRepository) {
    this.movieRepository = movieRepository;
    this.genreRepository = genreRepository;
    this.actorRepository = actorRepository;
  }

  public Page<Movie> getAllMovies(
      Long cityId, String language, String genre, Movie.Status status, Pageable pageable) {
    Specification<Movie> specification =
        Specification.where(MovieSpecification.hasCityId(cityId))
            .and(MovieSpecification.hasLanguage(language))
            .and(MovieSpecification.hasGenre(genre))
            .and(MovieSpecification.hasStatus(status));

    return movieRepository.findAll(specification, pageable);
  }

  public Movie addMovie(CreateMovieRequest request) {
    Movie movie = new Movie();

    movie.setTitle(request.getTitle());
    movie.setDescription(request.getDescription());
    movie.setDuration(request.getDuration());
    movie.setLanguage(request.getLanguage());

    List<Genre> genreList = new ArrayList<>();
    for (Long genreId : request.getGenreIds()) {
      genreList.add(genreRepository.findById(genreId).orElse(null));
    }
    movie.setGenres(genreList);

    List<Actor> actorList = new ArrayList<>();
    for (Long castId : request.getCastIds()) {
      actorList.add(actorRepository.findById(castId).orElse(null));
    }
    movie.setCast(actorList);

    String posterUrl = request.getPosterUrl();
    if (posterUrl == null || posterUrl.trim().isEmpty()) {
      // Auto-generate local URL from title (e.g., "The Matrix" -> "http://localhost:8080/uploads/the_matrix.jpg")
      String slug = request.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "_").replaceAll("^_+|_+$", "");
      posterUrl = "http://localhost:8080/uploads/" + slug + ".jpg";
    }
    movie.setPosterUrl(posterUrl);
    movie.setStatus(Movie.Status.NOW_SHOWING);

    return movieRepository.save(movie);
  }

  public Movie getMovieById(long id) {
    return movieRepository
        .findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
  }

  public Movie updateMovie(CreateMovieRequest request, long id) {
    Movie movie = getMovieById(id);
    movie.setTitle(request.getTitle());
    movie.setDescription(request.getDescription());
    movie.setDuration(request.getDuration());
    movie.setLanguage(request.getLanguage());
    List<Genre> genreList = new ArrayList<>();
    for (Long genreId : request.getGenreIds()) {
      genreList.add(genreRepository.findById(genreId).orElse(null));
    }
    movie.setGenres(genreList);
    List<Actor> actorList = new ArrayList<>();
    for (Long castId : request.getCastIds()) {
      actorList.add(actorRepository.findById(castId).orElse(null));
    }
    movie.setCast(actorList);
    String posterUrl = request.getPosterUrl();
    if (posterUrl == null || posterUrl.trim().isEmpty()) {
      String slug = request.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "_").replaceAll("^_+|_+$", "");
      posterUrl = "http://localhost:8080/uploads/" + slug + ".jpg";
    }
    movie.setPosterUrl(posterUrl);

    return movieRepository.save(movie);
  }

  public void deleteMovie(long id) {
    Movie movie = getMovieById(id);
    movieRepository.delete(movie);
  }

  public List<Movie> getTrendingMovies(int limit) {
    return movieRepository.findTrendingMovies(PageRequest.of(0, limit));
  }

  public List<Actor> getMovieCast(long id) {
    Movie movie = getMovieById(id);
    return movie.getCast();
  }

  public List<String> getMovieLanguages(long id) {
    Movie movie = getMovieById(id);
    // Assuming language is stored as CSV or single string for now.
    return List.of(movie.getLanguage().split(","));
  }
}

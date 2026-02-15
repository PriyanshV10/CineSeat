package com.cineseat.movie;

import com.cineseat.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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

    movie.setPosterUrl(request.getPosterUrl());

    return movieRepository.save(movie);
  }

  public Movie getMovieById(long id) {
    return movieRepository
        .findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
  }
}

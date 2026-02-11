package com.cineseat.movie;

import com.cineseat.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
public class MovieService {

  private final MovieRepository movieRepository;

  public MovieService(MovieRepository movieRepository) {
    this.movieRepository = movieRepository;
  }

  public List<Movie> getAllMovies() {
    return movieRepository.findAll();
  }

  public Movie addMovie(Movie movie) {
    return movieRepository.save(movie);
  }

  public Movie getMovieById(long id) {
    return movieRepository
        .findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
  }
}

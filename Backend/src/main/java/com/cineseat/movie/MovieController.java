package com.cineseat.movie;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

  private final MovieService movieService;

  public MovieController(MovieService movieService) {
    this.movieService = movieService;
  }

  @GetMapping
  public List<Movie> getMovies() {
    return movieService.getAllMovies();
  }

  @GetMapping("/{id}")
  public Movie getMovie(@PathVariable long id) {
    return movieService.getMovieById(id);
  }
}

package com.cineseat.movie;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/movies")
public class MovieController {

  private final MovieService movieService;

  public MovieController(MovieService movieService) {
    this.movieService = movieService;
  }

  @GetMapping
  public List<Movie> getMovies() {
    return movieService.getAllMovies();
  }

  @PostMapping
  public Movie addMovie(@RequestBody Movie movie) {
    return movieService.addMovie(movie);
  }
}

package com.cineseat.movie;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

  private final MovieService movieService;

  public MovieController(MovieService movieService) {
    this.movieService = movieService;
  }

  @GetMapping
  public Page<Movie> getMovies(
      @RequestParam(required = false) Long cityId,
      @RequestParam(required = false) String language,
      @RequestParam(required = false) String genre,
      @RequestParam(required = false) Movie.Status status,
      @PageableDefault(size = 20, sort = "title") Pageable pageable) {
    return movieService.getAllMovies(cityId, language, genre, status, pageable);
  }

  @GetMapping("/{id}")
  public Movie getMovie(@PathVariable long id) {
    return movieService.getMovieById(id);
  }
}

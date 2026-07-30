package com.cineseat.movie;

import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/movies")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMovieController {
  private final MovieService movieService;

  public AdminMovieController(MovieService movieService) {
    this.movieService = movieService;
  }

  @PostMapping
  public Movie addMovie(@Valid @RequestBody CreateMovieRequest request) {
    return movieService.addMovie(request);
  }

  @PutMapping("/{id}")
  public Movie updateMovie(@Valid @RequestBody CreateMovieRequest request, @PathVariable long id) {
    return movieService.updateMovie(request, id);
  }

  @DeleteMapping("/{id}")
  public void deleteMovie(@PathVariable long id) {
    movieService.deleteMovie(id);
  }
}

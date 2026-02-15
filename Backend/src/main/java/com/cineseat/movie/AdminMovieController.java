package com.cineseat.movie;

import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/movies")
@PreAuthorize("hasAnyRole('ADMIN', 'THEATER')")
public class AdminMovieController {
  private final MovieService movieService;

  public AdminMovieController(MovieService movieService) {
    this.movieService = movieService;
  }

  @PostMapping
  public Movie addMovie(@Valid @RequestBody CreateMovieRequest request) {
    return movieService.addMovie(request);
  }
}

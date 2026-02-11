package com.cineseat.theater;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/theaters")
@PreAuthorize("hasAnyRole('ADMIN', 'THEATER')")
public class AdminTheaterController {

  private final TheaterService theaterService;

  public AdminTheaterController(TheaterService theaterService) {
    this.theaterService = theaterService;
  }

  @PostMapping
  public ResponseEntity<Theater> addTheater(@Valid @RequestBody CreateTheaterRequest request) {
    Theater theater = theaterService.addTheater(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(theater);
  }
}

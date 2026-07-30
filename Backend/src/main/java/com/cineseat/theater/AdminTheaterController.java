package com.cineseat.theater;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/theaters")
@PreAuthorize("hasRole('ADMIN')")
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

  @PutMapping("/{id}")
  public ResponseEntity<Theater> updateTheater(@PathVariable Long id, @Valid @RequestBody CreateTheaterRequest request) {
    Theater theater = theaterService.updateTheater(id, request);
    return ResponseEntity.ok(theater);
  }
}

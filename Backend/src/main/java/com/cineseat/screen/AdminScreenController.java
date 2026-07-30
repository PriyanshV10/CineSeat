package com.cineseat.screen;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.cineseat.seat.Seat;
import com.cineseat.seat.SeatLayoutRequest;
import com.cineseat.seat.SeatService;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'THEATER')")
public class AdminScreenController {

  private final ScreenService screenService;
  private final SeatService seatService;

  public AdminScreenController(ScreenService screenService, SeatService seatService) {
    this.screenService = screenService;
    this.seatService = seatService;
  }

  @GetMapping("/theaters/{id}/screens")
  public ResponseEntity<List<Screen>> getScreens(@PathVariable Long id) {
    return ResponseEntity.ok(screenService.getScreensByTheaterId(id));
  }

  @PostMapping("/theaters/{id}/screens")
  public ResponseEntity<Screen> addScreen(@PathVariable Long id, @Valid @RequestBody CreateScreenRequest request) {
    Screen screen = screenService.addScreen(id, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(screen);
  }

  @PostMapping("/screens/{id}/seat-layout")
  public ResponseEntity<List<Seat>> configureSeatLayout(@PathVariable Long id, @Valid @RequestBody SeatLayoutRequest request) {
    List<Seat> seats = seatService.generateSeatLayout(id, request);
    return ResponseEntity.ok(seats);
  }
}

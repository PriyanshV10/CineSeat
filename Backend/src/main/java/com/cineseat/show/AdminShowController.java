package com.cineseat.show;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/shows")
@PreAuthorize("hasAnyRole('ADMIN', 'THEATER')")
public class AdminShowController {

  private final ShowService showService;

  public AdminShowController(ShowService showService) {
    this.showService = showService;
  }

  @PostMapping
  public ResponseEntity<Show> addShow(@Valid @RequestBody CreateShowRequest request) {
    Show show = showService.addShow(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(show);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Show> updateShow(@PathVariable Long id, @Valid @RequestBody CreateShowRequest request) {
    Show show = showService.updateShow(id, request);
    return ResponseEntity.ok(show);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteShow(@PathVariable Long id) {
    showService.deleteShow(id);
    return ResponseEntity.noContent().build();
  }
}

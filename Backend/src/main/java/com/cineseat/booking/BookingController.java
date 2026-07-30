package com.cineseat.booking;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

  private final BookingService bookingService;

  public BookingController(BookingService bookingService) {
    this.bookingService = bookingService;
  }

  @PostMapping
  public ResponseEntity<Booking> createBooking(@Valid @RequestBody CreateBookingRequest request) {
    Booking booking = bookingService.createBooking(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(booking);
  }

  @PostMapping("/{id}/confirm")
  public ResponseEntity<String> confirmBooking(@PathVariable Long id) {
    // In a real application, this would probably be called via a webhook from a payment gateway.
    bookingService.confirmBooking(id);
    return ResponseEntity.ok("Booking confirmed");
  }

  @GetMapping("/{id}")
  public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
    return ResponseEntity.ok(bookingService.getBookingById(id));
  }

  @PatchMapping("/{id}/cancel")
  public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
    bookingService.cancelBooking(id);
    return ResponseEntity.ok("Booking cancelled");
  }

  @GetMapping("/{id}/ticket")
  public ResponseEntity<String> getTicket(@PathVariable Long id) {
    return ResponseEntity.ok(bookingService.generateTicket(id));
  }

  @GetMapping("/me")
  public ResponseEntity<List<Booking>> getUserBookings() {
    return ResponseEntity.ok(bookingService.getUserBookings());
  }
}

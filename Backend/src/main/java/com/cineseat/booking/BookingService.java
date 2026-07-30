package com.cineseat.booking;

import com.cineseat.exception.ResourceNotFoundException;
import com.cineseat.show.Show;
import com.cineseat.show.ShowService;
import com.cineseat.seat.ShowSeat;
import com.cineseat.seat.ShowSeatRepository;
import com.cineseat.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

  private final BookingRepository bookingRepository;
  private final ShowSeatRepository showSeatRepository;
  private final ShowService showService;
  private final UserService userService;

  public BookingService(
      BookingRepository bookingRepository,
      ShowSeatRepository showSeatRepository,
      ShowService showService,
      UserService userService) {
    this.bookingRepository = bookingRepository;
    this.showSeatRepository = showSeatRepository;
    this.showService = showService;
    this.userService = userService;
  }

  @Transactional
  public Booking createBooking(CreateBookingRequest request) {
    Show show = showService.getShowById(request.getShowId());
    
    // Pessimistic write lock to prevent race conditions during checkout
    List<ShowSeat> selectedSeats = showSeatRepository.findByIdsWithPessimisticWriteLock(request.getShowSeatIds());

    if (selectedSeats.size() != request.getShowSeatIds().size()) {
      throw new RuntimeException("One or more seats are invalid.");
    }

    BigDecimal totalPrice = BigDecimal.ZERO;
    for (ShowSeat seat : selectedSeats) {
      if (seat.getStatus() != ShowSeat.SeatStatus.AVAILABLE) {
        throw new RuntimeException("Seat " + seat.getSeat().getSeatNumber() + " is no longer available.");
      }
      // Lock the seat
      seat.setStatus(ShowSeat.SeatStatus.LOCKED);
      totalPrice = totalPrice.add(seat.getPrice());
    }

    // Save locked seats
    showSeatRepository.saveAll(selectedSeats);

    Booking booking = new Booking();
    booking.setUser(userService.getCurrentUser());
    booking.setShow(show);
    booking.setShowSeats(selectedSeats);
    booking.setStatus(Booking.BookingStatus.PENDING);
    booking.setBookingTime(LocalDateTime.now());
    // E.g. give them 10 mins to pay
    booking.setExpirationTime(LocalDateTime.now().plusMinutes(10));
    booking.setTotalPrice(totalPrice);

    return bookingRepository.save(booking);
  }

  @Transactional
  public void confirmBooking(Long bookingId) {
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
    if (booking.getStatus() != Booking.BookingStatus.PENDING) {
        throw new RuntimeException("Booking is not in a pending state");
    }

    booking.setStatus(Booking.BookingStatus.CONFIRMED);
    for (ShowSeat seat : booking.getShowSeats()) {
        seat.setStatus(ShowSeat.SeatStatus.BOOKED);
    }
    
    showSeatRepository.saveAll(booking.getShowSeats());
    bookingRepository.save(booking);
  }

  @Scheduled(fixedRate = 60000) // Run every minute
  @Transactional
  public void expirePendingBookings() {
    List<Booking> expiredBookings = bookingRepository.findByStatusAndExpirationTimeBefore(
        Booking.BookingStatus.PENDING, LocalDateTime.now());

    for (Booking booking : expiredBookings) {
      booking.setStatus(Booking.BookingStatus.EXPIRED);
      for (ShowSeat seat : booking.getShowSeats()) {
        seat.setStatus(ShowSeat.SeatStatus.AVAILABLE);
      }
      showSeatRepository.saveAll(booking.getShowSeats());
    }

    if (!expiredBookings.isEmpty()) {
      bookingRepository.saveAll(expiredBookings);
    }
  }

  public Booking getBookingById(Long id) {
    return bookingRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
  }

  @Transactional
  public void cancelBooking(Long id) {
    Booking booking = getBookingById(id);
    
    // Allow cancellation if pending or confirmed, depending on business rules.
    // Assuming we can cancel confirmed bookings before show starts.
    if (booking.getStatus() == Booking.BookingStatus.CANCELLED || booking.getStatus() == Booking.BookingStatus.EXPIRED) {
      throw new RuntimeException("Booking is already cancelled or expired");
    }

    booking.setStatus(Booking.BookingStatus.CANCELLED);
    for (ShowSeat seat : booking.getShowSeats()) {
      seat.setStatus(ShowSeat.SeatStatus.AVAILABLE);
    }
    showSeatRepository.saveAll(booking.getShowSeats());
    bookingRepository.save(booking);
  }

  public String generateTicket(Long id) {
    Booking booking = getBookingById(id);
    if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
      throw new RuntimeException("Cannot generate ticket for non-confirmed booking");
    }
    // Return a dummy QR code string or ticket data
    return "TICKET-QR-DATA-" + booking.getId() + "-" + booking.getUser().getId();
  }

  public List<Booking> getUserBookings() {
    return bookingRepository.findByUser(userService.getCurrentUser());
  }
}

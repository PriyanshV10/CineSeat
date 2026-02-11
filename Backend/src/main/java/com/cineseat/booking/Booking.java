package com.cineseat.booking;

import com.cineseat.seat.ShowSeat;
import com.cineseat.show.Show;
import com.cineseat.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne
  @JoinColumn(name = "show_id", nullable = false)
  private Show show;

  @ManyToMany
  @JoinTable(
      name = "booking_show_seats",
      joinColumns = @JoinColumn(name = "booking_id"),
      inverseJoinColumns = @JoinColumn(name = "show_seat_id"))
  private List<ShowSeat> showSeats;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private BookingStatus status;

  @Column(nullable = false)
  private LocalDateTime bookingTime;

  private LocalDateTime expirationTime;
  private BigDecimal totalPrice;

  public enum BookingStatus {
    PENDING,
    CONFIRMED,
    CANCELLED,
    EXPIRED
  }
}

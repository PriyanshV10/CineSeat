package com.cineseat.seat;

import com.cineseat.screen.Screen;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "screen")
public class Seat {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String seatNumber; // e.g., "A1", "B5"

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private SeatType seatType;

  @ManyToOne
  @JoinColumn(name = "screen_id", nullable = false)
  private Screen screen;

  public enum SeatType {
    REGULAR,
    PREMIUM,
    RECLINER
  }
}

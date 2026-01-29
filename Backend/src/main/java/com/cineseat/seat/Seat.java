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

  private String seatNumber;

  @Enumerated(EnumType.STRING)
  private SeatType seatType;

  @ManyToOne
  @JoinColumn(name = "screen_id", nullable = false)
  private Screen screen;
}

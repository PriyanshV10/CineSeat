package com.cineseat.seat;

import com.cineseat.show.Show;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"show_id", "seat_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"show", "seat"})
public class ShowSeat {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "show_id", nullable = false)
  private Show show;

  @ManyToOne
  @JoinColumn(name = "seat_id", nullable = false)
  private Seat seat;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private SeatStatus status;

  private LocalDateTime lockedUntil;
}

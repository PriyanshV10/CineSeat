package com.cineseat.show;

import com.cineseat.movie.Movie;
import com.cineseat.screen.Screen;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"movie", "screen"})
public class Show {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "movie_id", nullable = false)
  private Movie movie;

  @ManyToOne
  @JoinColumn(name = "screen_id", nullable = false)
  private Screen screen;

  @Column(nullable = false)
  private LocalDateTime startTime;

  @Column(nullable = false)
  private BigDecimal price;
}

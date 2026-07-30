package com.cineseat.movie;

import com.cineseat.actor.Actor;
import com.cineseat.genre.Genre;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Movie {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String description;

  private Integer duration;

  private String language;

  @ManyToMany
  @JoinTable(
      name = "movie_genres",
      joinColumns = @JoinColumn(name = "movie_id"),
      inverseJoinColumns = @JoinColumn(name = "genre_id"))
  private List<Genre> genres;

  @ManyToMany
  @JoinTable(
      name = "movie_cast",
      joinColumns = @JoinColumn(name = "movie_id"),
      inverseJoinColumns = @JoinColumn(name = "actor_id"))
  private List<Actor> cast;

  private String posterUrl;

  private Double rating; // e.g., 4.5

  @Enumerated(EnumType.STRING)
  private Status status;

  public enum Status {
    NOW_SHOWING,
    UPCOMING,
    COMING_SOON
  }
}

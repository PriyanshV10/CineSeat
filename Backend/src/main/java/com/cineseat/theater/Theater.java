package com.cineseat.theater;

import com.cineseat.city.City;
import com.cineseat.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"owner", "city"})
public class Theater {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  private String address;

  @ManyToOne
  @JoinColumn(name = "city_id", nullable = false)
  private City city;

  @ManyToOne
  @JoinColumn(name = "owner_id", nullable = false)
  private User owner;
}

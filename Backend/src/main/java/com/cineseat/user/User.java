package com.cineseat.user;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "password")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true)
  private String email;

  private String password;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;

  private String phoneNumber;
  private String avatarUrl;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_auth_providers", joinColumns = @JoinColumn(name = "user_id"))
  @Enumerated(EnumType.STRING)
  @Column(name = "provider")
  private Set<AuthProvider> authProvider = new HashSet<>();

  public enum AuthProvider {
    LOCAL,
    GOOGLE
  }

  public enum Role {
    USER,
    THEATER,
    ADMIN
  }
}

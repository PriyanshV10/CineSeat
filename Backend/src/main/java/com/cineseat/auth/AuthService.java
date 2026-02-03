package com.cineseat.auth;

import com.cineseat.security.JwtService;
import com.cineseat.user.User;
import com.cineseat.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final PasswordEncoder passwordEncoder;

  public AuthService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.passwordEncoder = passwordEncoder;
  }

  public AuthResponse register(RegisterRequest registerRequest) {
    if (userRepository.findByEmail(registerRequest.getEmail()) != null) {
      throw new RuntimeException("Email Already Exists");
    }

    User user = new User();
    user.setEmail(registerRequest.getEmail());
    user.setName(registerRequest.getName());
    user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
    user.setRole(registerRequest.getRole());
    user.setAuthProvider(User.AuthProvider.LOCAL);

    userRepository.save(user);

    String token = jwtService.generateToken(user.getEmail());
    return new AuthResponse(token, user.getName(), user.getEmail());
  }

  public AuthResponse login(LoginRequest loginRequest) {
    User user = userRepository.findByEmail(loginRequest.getEmail());

    if (user == null) {
      throw new RuntimeException("User not found");
    }

    if (user.getAuthProvider() != User.AuthProvider.LOCAL) {
      throw new RuntimeException("Invalid Authentication Method");
    }

    if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
      throw new RuntimeException("Invalid Password");
    }

    String token = jwtService.generateToken(user.getEmail());
    return new AuthResponse(token, user.getName(), user.getEmail());
  }
}

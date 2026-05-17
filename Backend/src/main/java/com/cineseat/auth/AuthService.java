package com.cineseat.auth;

import com.cineseat.security.JwtService;
import com.cineseat.user.User;
import com.cineseat.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class AuthService {

  @Value("${jwt.refreshExpirationMs}")
  private int refreshExpirationMs;

  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final PasswordEncoder passwordEncoder;
  private final RefreshTokenService refreshTokenService;

  public AuthService(
      UserRepository userRepository,
      JwtService jwtService,
      PasswordEncoder passwordEncoder,
      RefreshTokenService refreshTokenService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.passwordEncoder = passwordEncoder;
    this.refreshTokenService = refreshTokenService;
  }

  public AuthResponse register(RegisterRequest registerRequest) {
    if (userRepository.findByEmail(registerRequest.getEmail()) != null) {
      throw new RuntimeException("Email Already Exists");
    }

    User user = new User();
    user.setEmail(registerRequest.getEmail());
    user.setName(registerRequest.getName());
    user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
    user.setRole(User.Role.USER);
    user.setAuthProvider(User.AuthProvider.LOCAL);

    userRepository.save(user);

    String accessToken = jwtService.generateToken(user.getEmail());
    refreshTokenService.deleteByUserId(user.getId());
    RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

    return new AuthResponse(accessToken, refreshToken.getToken(), user.getName(), user.getEmail());
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

    String accessToken = jwtService.generateToken(user.getEmail());
    refreshTokenService.deleteByUserId(user.getId());
    RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

    return new AuthResponse(accessToken, refreshToken.getToken(), user.getName(), user.getEmail());
  }

  public AuthResponse refreshToken(TokenRefreshRequest request) {
    String requestRefreshToken = request.getRefreshToken();

    RefreshToken refreshToken =
        refreshTokenService.verifyExpiration(
            refreshTokenService
                .findByToken(requestRefreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh Token not found")));

    User user = refreshToken.getUser();
    String accessToken = jwtService.generateToken(user.getEmail());

    return new AuthResponse(accessToken, refreshToken.getToken(), user.getName(), user.getEmail());
  }

  public void logout(String refreshTokenString) {
    RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenString).orElse(null);

    if (refreshToken != null) {
      refreshTokenService.deleteByUserId(refreshToken.getUser().getId());
    }
  }

  public ResponseCookie createResponseCookie(String token) {
    return ResponseCookie.from("refreshToken", token == null ? "" : token)
        .httpOnly(true)
        .secure(false) // TODO: in production, set true
        .path("/")
        .maxAge(token == null ? 0 : refreshExpirationMs / 1000)
        .sameSite("Lax")
        .build();
  }
}

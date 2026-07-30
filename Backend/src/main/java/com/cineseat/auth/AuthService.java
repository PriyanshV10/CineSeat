package com.cineseat.auth;

import com.cineseat.security.JwtService;
import com.cineseat.user.User;
import com.cineseat.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import com.cineseat.email.EmailService;

@Service
public class AuthService {

  @Value("${jwt.refreshExpirationMs}")
  private int refreshExpirationMs;

  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final PasswordEncoder passwordEncoder;
  private final RefreshTokenService refreshTokenService;
  private final VerificationTokenRepository verificationTokenRepository;
  private final EmailService emailService;

  public AuthService(
      UserRepository userRepository,
      JwtService jwtService,
      PasswordEncoder passwordEncoder,
      RefreshTokenService refreshTokenService,
      VerificationTokenRepository verificationTokenRepository,
      EmailService emailService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.passwordEncoder = passwordEncoder;
    this.refreshTokenService = refreshTokenService;
    this.verificationTokenRepository = verificationTokenRepository;
    this.emailService = emailService;
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
    user.setAuthProvider(new HashSet<>(List.of(User.AuthProvider.LOCAL)));

    userRepository.save(user);

    String token = UUID.randomUUID().toString();
    VerificationToken verificationToken = new VerificationToken(token, user);
    verificationTokenRepository.save(verificationToken);
    
    emailService.sendVerificationEmail(user.getEmail(), token);

    String accessToken = jwtService.generateToken(user.getEmail());
    refreshTokenService.deleteByUserId(user.getId());
    RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

    return new AuthResponse(accessToken, refreshToken.getToken(), user.getName(), user.getEmail());
  }

  public void verifyEmail(String token) {
    VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
        .orElseThrow(() -> new RuntimeException("Invalid verification token"));

    if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
      throw new RuntimeException("Verification token has expired");
    }

    User user = verificationToken.getUser();
    user.setEmailVerified(true);
    userRepository.save(user);
    verificationTokenRepository.delete(verificationToken);
  }

  public AuthResponse login(LoginRequest loginRequest) {
    User user = userRepository.findByEmail(loginRequest.getEmail());

    if (user == null) {
      throw new RuntimeException("User not found");
    }

    if (!user.getAuthProvider().contains(User.AuthProvider.LOCAL)) {
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

package com.cineseat.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  @Value("${jwt.refreshExpirationMs}")
  private Long refreshTokenDurationMs;

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
    //        return ResponseEntity.ok(authService.register(registerRequest));
    AuthResponse response = authService.register(registerRequest);
    ResponseCookie cookie = authService.createResponseCookie(response.getRefreshToken());

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(
            new AuthResponse(
                response.getAccessToken(), null, response.getName(), response.getEmail()));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
    //    return ResponseEntity.ok(authService.login(loginRequest));
    AuthResponse response = authService.login(loginRequest);

    ResponseCookie cookie = authService.createResponseCookie(response.getRefreshToken());

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(
            new AuthResponse(
                response.getAccessToken(), null, response.getName(), response.getEmail()));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(
      @CookieValue(value = "refreshToken", required = false) String refreshToken) {

    if (refreshToken != null) {
      authService.logout(refreshToken);
    }

    ResponseCookie cookie = authService.createResponseCookie(null);

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body("Logged out successfully");
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<AuthResponse> refreshToken(
      @CookieValue(value = "refreshToken", required = false) String refreshToken) {

    if (refreshToken == null) {
      throw new RuntimeException("Refresh token missing");
    }

    TokenRefreshRequest request = new TokenRefreshRequest(refreshToken);

    AuthResponse response = authService.refreshToken(request);

    return ResponseEntity.ok(
        new AuthResponse(response.getAccessToken(), null, response.getName(), response.getEmail()));
  }
}

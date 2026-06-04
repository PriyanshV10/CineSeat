package com.cineseat.auth.password;

import com.cineseat.auth.RefreshTokenService;
import com.cineseat.email.EmailService;
import com.cineseat.exception.ResourceNotFoundException;
import com.cineseat.user.User;
import com.cineseat.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordService {

  private final UserRepository userRepository;
  private final TokenRepository tokenRepository;
  private final EmailService emailService;
  private final PasswordEncoder passwordEncoder;

  public PasswordService(
      UserRepository userRepository,
      TokenRepository tokenRepository,
      EmailService emailService,
      PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
    this.emailService = emailService;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public void sendResetPasswordEmail(String email) {
    User user = userRepository.findByEmail(email);
    if (user == null) {
      throw new ResourceNotFoundException("User not found");
    }

    String token = UUID.randomUUID().toString();
    ForgotPasswordToken forgotPasswordToken =
        tokenRepository.findByUser(user).orElse(new ForgotPasswordToken());
    forgotPasswordToken.setToken(token);
    forgotPasswordToken.setUser(user);
    forgotPasswordToken.setCreatedAt(LocalDateTime.now());
    forgotPasswordToken.setExpiresAt(LocalDateTime.now().plusMinutes(15));

    tokenRepository.save(forgotPasswordToken);

    emailService.sendPasswordResetEmail(email, token);
  }

  public void updatePassword(String token, String newPassword) {
    ForgotPasswordToken resetToken =
        tokenRepository
            .findByToken(token)
            .orElseThrow(() -> new ResourceNotFoundException("Token not found"));

    User user = resetToken.getUser();
    if (user == null) {
      throw new ResourceNotFoundException("Invalid token");
    }

    if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
      throw new ResourceNotFoundException("Invalid token");
    }

    user.setPassword(passwordEncoder.encode(newPassword));
    user.getAuthProvider().add(User.AuthProvider.LOCAL);

    userRepository.save(user);
    tokenRepository.delete(resetToken);
  }
}

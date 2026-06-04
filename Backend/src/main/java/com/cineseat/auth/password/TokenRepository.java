package com.cineseat.auth.password;

import com.cineseat.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<ForgotPasswordToken, Long> {
  Optional<ForgotPasswordToken> findByToken(String token);

  void deleteByUser(User user);

  Optional<ForgotPasswordToken> findByUser(User user);
}

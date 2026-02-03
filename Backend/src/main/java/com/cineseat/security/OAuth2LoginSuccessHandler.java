package com.cineseat.security;

import com.cineseat.user.Role;
import com.cineseat.user.User;
import com.cineseat.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

  private final JwtService jwtService;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Value("${frontend.url}")
  private String frontendUrl;

  public OAuth2LoginSuccessHandler(
      JwtService jwtService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.jwtService = jwtService;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void onAuthenticationSuccess(
      HttpServletRequest request, HttpServletResponse response, Authentication authentication)
      throws IOException {
    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    String email = oAuth2User.getAttribute("email");
    String name = oAuth2User.getAttribute("name");

    User user = userRepository.findByEmail(email);

    if (user == null) {
      user = new User();
      user.setEmail(email);
      user.setName(name);
      user.setRole(Role.USER);
      user.setAuthProvider(User.AuthProvider.GOOGLE);
      user.setPassword(passwordEncoder.encode("OAUTH_DUMMY"));
      userRepository.save(user);
    }

    String token = jwtService.generateToken(user.getEmail());

    getRedirectStrategy()
        .sendRedirect(request, response, frontendUrl + "/oauth/callback?token=" + token);
  }
}

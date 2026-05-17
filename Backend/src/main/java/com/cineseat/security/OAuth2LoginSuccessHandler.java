package com.cineseat.security;

import com.cineseat.user.User;
import com.cineseat.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
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
    OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
    String provider = oauthToken.getAuthorizedClientRegistrationId().toUpperCase();

    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    String email = oAuth2User.getAttribute("email");
    String name = oAuth2User.getAttribute("name");
    String avatarUrl = oAuth2User.getAttribute("picture");

    User user = userRepository.findByEmail(email);

    if (user == null) {
      user = new User();
      user.setEmail(email);
      user.setName(name);
      user.setRole(User.Role.USER);
      user.setAuthProvider(User.AuthProvider.valueOf(provider));
      user.setPassword(null);
      user.setAvatarUrl(avatarUrl);
      userRepository.save(user);
    }
    else if(user.getAvatarUrl() == null) {
      user.setAvatarUrl(avatarUrl);
      userRepository.save(user);
    }

    String token = jwtService.generateToken(user.getEmail());

    getRedirectStrategy()
        .sendRedirect(request, response, frontendUrl + "/oauth/callback?token=" + token);
  }
}

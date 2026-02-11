package com.cineseat.user;

import com.cineseat.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null
        && authentication.getPrincipal() instanceof UserPrincipal principal) {
      return principal.getUser();
    }
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  @Transactional
  public User updateCurrentUser(UpdateUserRequest request) {
    User currentUser = getCurrentUser();

    if (request.getName() != null) {
      currentUser.setName(request.getName());
    }
    if (request.getPhoneNumber() != null) {
      String phone = request.getPhoneNumber().trim();
      currentUser.setPhoneNumber(phone.isEmpty() ? null : phone);
    }

    userRepository.save(currentUser);
    return currentUser;
  }

  @Transactional
  public void updateAvatarUrl(String avatarUrl) {
    User user = getCurrentUser();

    user.setAvatarUrl(avatarUrl);
    userRepository.save(user);
  }
}

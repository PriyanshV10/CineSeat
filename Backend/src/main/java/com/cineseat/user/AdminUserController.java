package com.cineseat.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.cineseat.user.User;
import com.cineseat.user.UserService;
import com.cineseat.user.UpdateRoleRequest;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

  private final UserService userService;

  public AdminUserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public ResponseEntity<List<User>> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
  }

  @PatchMapping("/{id}/role")
  public ResponseEntity<User> updateUserRole(
      @PathVariable Long id, @RequestBody UpdateRoleRequest request) {
    User.Role roleEnum = User.Role.valueOf(request.getRole().toUpperCase());
    User updatedUser = userService.updateUserRole(id, roleEnum);
    return ResponseEntity.ok(updatedUser);
  }
}

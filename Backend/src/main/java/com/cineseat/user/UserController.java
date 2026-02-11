package com.cineseat.user;

import com.cineseat.service.UploadService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/users/me")
public class UserController {

  private final UserService userService;
  private final UploadService uploadService;

  public UserController(UserService userService, UploadService uploadService) {
    this.userService = userService;
    this.uploadService = uploadService;
  }

  private static GetUserDTO getUserDTO(User user) {
    GetUserDTO getUserDTO = new GetUserDTO();
    getUserDTO.setEmail(user.getEmail());
    getUserDTO.setName(user.getName());
    getUserDTO.setPhoneNumber(user.getPhoneNumber());
    getUserDTO.setAvatarUrl(user.getAvatarUrl());
    getUserDTO.setId(user.getId());
    getUserDTO.setRole(user.getRole());
    getUserDTO.setAuthProvider(user.getAuthProvider());

    return getUserDTO;
  }

  @GetMapping()
  public ResponseEntity<GetUserDTO> getCurrentUser() {
    User user = userService.getCurrentUser();
    return ResponseEntity.ok(getUserDTO(user));
  }

  @PutMapping()
  public ResponseEntity<GetUserDTO> updateUser(@Valid @RequestBody UpdateUserRequest request) {
    User user = userService.updateCurrentUser(request);
    return ResponseEntity.ok(getUserDTO(user));
  }

  @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> updateAvatar(@RequestParam("file") MultipartFile file) throws IOException {
    String url = uploadService.store(file);
    userService.updateAvatarUrl(url);
    return ResponseEntity.ok(getUserDTO(userService.getCurrentUser()));
  }
}

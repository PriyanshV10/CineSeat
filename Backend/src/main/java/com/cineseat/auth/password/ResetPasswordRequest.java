package com.cineseat.auth.password;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {
  @NotBlank String token;

  @NotBlank
  @Size(min = 8)
  String password;
}

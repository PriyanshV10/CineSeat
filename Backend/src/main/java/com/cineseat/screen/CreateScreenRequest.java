package com.cineseat.screen;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateScreenRequest {
  @NotBlank(message = "Screen name is required")
  private String name;
}

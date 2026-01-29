package com.cineseat.theater;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CreateTheaterRequest {
  @NotBlank(message = "Theater name is required")
  private String name;

  @NotBlank(message = "Address is required")
  private String address;

  @NotBlank(message = "City is required")
  private Long cityId;
}

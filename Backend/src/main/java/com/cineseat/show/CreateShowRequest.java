package com.cineseat.show;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class CreateShowRequest {

  @NotNull(message = "Movie ID is required")
  private Long movieId;

  @NotNull(message = "Screen ID is required")
  private Long screenId;

  @NotNull(message = "Start time is required")
  private LocalDateTime startTime;

  @NotNull(message = "Price is required")
  private BigDecimal price;
}

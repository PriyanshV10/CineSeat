package com.cineseat.booking;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateBookingRequest {
  @NotNull(message = "Show ID is required")
  private Long showId;

  @NotEmpty(message = "ShowSeat IDs are required")
  private List<Long> showSeatIds;
}

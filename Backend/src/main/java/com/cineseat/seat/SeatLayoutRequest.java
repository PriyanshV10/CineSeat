package com.cineseat.seat;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SeatLayoutRequest {

  @NotEmpty(message = "Rows are required")
  private List<String> rows;

  @NotNull(message = "Seats per row is required")
  private Integer seatsPerRow;

  private List<Integer> aisleColumns; // Can be empty or null
}

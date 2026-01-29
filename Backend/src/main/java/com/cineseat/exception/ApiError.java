package com.cineseat.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ApiError {
  private int status;
  private String message;
  private LocalDateTime timestamp;

  public ApiError() {
    super();
  }

  public ApiError(int status, String message, LocalDateTime timestamp) {
    super();
    this.status = status;
    this.message = message;
    this.timestamp = timestamp;
  }
}

package com.cineseat.movie;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CreateMovieRequest {
  @NotBlank(message = "Title is required")
  private String title;

  private String description;

  @NotBlank(message = "Duration is required") @Min(1)
  private Integer duration;

  private String language;
  private List<Long> genreIds;
  private List<Long> castIds;
  private String posterUrl;
}

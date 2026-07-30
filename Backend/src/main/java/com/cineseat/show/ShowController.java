package com.cineseat.show;

import org.springframework.web.bind.annotation.*;
import com.cineseat.seat.ShowSeat;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/shows")
public class ShowController {

  private final ShowService showService;

  public ShowController(ShowService showService) {
    this.showService = showService;
  }

  @GetMapping
  public List<Show> getShows(
      @RequestParam(required = false) Long movieId,
      @RequestParam(required = false) Long cityId,
      @RequestParam(required = false) LocalDate date) {
    return showService.getShows(movieId, cityId, date);
  }

  @GetMapping("/{id}")
  public Show getShow(@PathVariable Long id) {
    return showService.getShowById(id);
  }

  @GetMapping("/{id}/seats")
  public List<ShowSeat> getShowSeats(@PathVariable Long id) {
    return showService.getShowSeats(id);
  }
}

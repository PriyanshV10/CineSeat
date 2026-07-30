package com.cineseat.theater;

import com.cineseat.show.ShowService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/theaters")
public class TheaterController {

  private final TheaterService theaterService;
  private final ShowService showService;

  public TheaterController(TheaterService theaterService, ShowService showService) {
    this.theaterService = theaterService;
    this.showService = showService;
  }

  @GetMapping()
  public List<Theater> getTheaters(@RequestParam(required = false) Long cityId) {
    if (cityId != null) {
      return theaterService.getTheatersByCityId(cityId);
    }
    return theaterService.getAllTheaters();
  }

  @GetMapping("/{id}")
  public Theater getTheater(@PathVariable Long id) {
    return theaterService.getTheaterById(id);
  }

  @GetMapping("/{id}/shows")
  public List<?> getTheaterShows(@PathVariable Long id, @RequestParam(required = false) String date) {
    LocalDate parsedDate = date != null ? LocalDate.parse(date) : null;
    return showService.getShowsByTheaterId(id, parsedDate);
  }
}

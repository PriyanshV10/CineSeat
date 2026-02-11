package com.cineseat.theater;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/theaters")
public class TheaterController {

  private final TheaterService theaterService;

  public TheaterController(TheaterService theaterService) {
    this.theaterService = theaterService;
  }

  @GetMapping()
  public List<Theater> getTheaters(@RequestParam(required = false) Long cityId) {
    if (cityId != null) {
      return theaterService.getTheatersByCityId(cityId);
    }
    return theaterService.getAllTheaters();
  }
}

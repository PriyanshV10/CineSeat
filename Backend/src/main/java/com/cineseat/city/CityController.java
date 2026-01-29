package com.cineseat.city;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/cities")
public class CityController {

  private final CityService cityService;

  public CityController(CityService cityService) {
    this.cityService = cityService;
  }

  // api/cities?name={name}
  @GetMapping
  public List<City> getCities(@RequestParam(required = false) String name) {
    if (name == null) {
      return cityService.getAllCities();
    }
    return cityService.getCitiesByName(name);
  }

  @GetMapping("/{id}")
  public City getCityById(@PathVariable Long id) {
    return cityService.getCityById(id);
  }
}

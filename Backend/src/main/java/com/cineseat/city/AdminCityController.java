package com.cineseat.city;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/cities")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCityController {

  private final CityService cityService;

  public AdminCityController(CityService cityService) {
    this.cityService = cityService;
  }

  @PostMapping
  public ResponseEntity<City> addCity(@Valid @RequestBody CreateCityRequest request) {
    City city = cityService.addCity(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(city);
  }
}

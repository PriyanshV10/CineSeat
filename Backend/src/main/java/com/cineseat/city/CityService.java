package com.cineseat.city;

import com.cineseat.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityService {

  private final CityRepository cityRepository;

  public CityService(CityRepository cityRepository) {
    this.cityRepository = cityRepository;
  }

  public List<City> getAllCities() {
    return cityRepository.findAll();
  }

  public City getCityById(Long id) {
    return cityRepository
        .findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("City not found"));
  }

  public List<City> getCitiesByName(String cityName) {
    List<City> cities = cityRepository.findCitiesByNameIgnoreCase(cityName);

    if (cities.isEmpty()) {
      throw new ResourceNotFoundException("City not found");
    }

    return cities;
  }
}

package com.cineseat.theater;

import com.cineseat.city.City;
import com.cineseat.city.CityRepository;
import com.cineseat.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheaterService {

  private final TheaterRepository theaterRepository;
  private final CityRepository cityRepository;

  public TheaterService(TheaterRepository theaterRepository, CityRepository cityRepository) {
    this.theaterRepository = theaterRepository;
    this.cityRepository = cityRepository;
  }

  public List<Theater> getAllTheaters() {
    return theaterRepository.findAll();
  }

  public Theater getTheaterById(Long id) {
    return theaterRepository
        .findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Theater not found!"));
  }

  public List<Theater> getTheatersByCityId(Long cityId) {
    City city =
        cityRepository
            .findById(cityId)
            .orElseThrow(() -> new ResourceNotFoundException("City not found!"));
    return theaterRepository.findTheatersByCity(city);
  }

  public Theater addTheater(CreateTheaterRequest request) {
    City city =
        cityRepository
            .findById(request.getCityId())
            .orElseThrow(() -> new ResourceNotFoundException("City not found!"));

    Theater theater = new Theater();
    theater.setName(request.getName());
    theater.setAddress(request.getAddress());
    theater.setCity(city);
    // TODO: add user too, in theater object

    return theaterRepository.save(theater);
  }
}

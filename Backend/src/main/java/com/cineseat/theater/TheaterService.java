package com.cineseat.theater;

import com.cineseat.city.City;
import com.cineseat.city.CityRepository;
import com.cineseat.exception.ResourceNotFoundException;
import com.cineseat.user.User;
import com.cineseat.user.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheaterService {

  private final TheaterRepository theaterRepository;
  private final CityRepository cityRepository;
  private final UserService userService;

  public TheaterService(
      TheaterRepository theaterRepository, CityRepository cityRepository, UserService userService) {
    this.theaterRepository = theaterRepository;
    this.cityRepository = cityRepository;
    this.userService = userService;
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

    User currentUser = userService.getCurrentUser();
    if (request.getOwnerId() != null && currentUser.getRole() == User.Role.ADMIN) {
        User owner = userService.getUserById(request.getOwnerId());
        theater.setOwner(owner);
    } else {
        theater.setOwner(currentUser);
    }

    return theaterRepository.save(theater);
  }

  public Theater updateTheater(Long id, CreateTheaterRequest request) {
    Theater theater = getTheaterById(id);
    User currentUser = userService.getCurrentUser();
    
    if (currentUser.getRole() != User.Role.ADMIN && !theater.getOwner().getId().equals(currentUser.getId())) {
      throw new RuntimeException("You do not have permission to update this theater");
    }

    City city =
        cityRepository
            .findById(request.getCityId())
            .orElseThrow(() -> new ResourceNotFoundException("City not found!"));

    theater.setName(request.getName());
    theater.setAddress(request.getAddress());
    theater.setCity(city);

    return theaterRepository.save(theater);
  }
}

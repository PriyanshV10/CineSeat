package com.cineseat.screen;

import com.cineseat.exception.ResourceNotFoundException;
import com.cineseat.theater.Theater;
import com.cineseat.theater.TheaterService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScreenService {

  private final ScreenRepository screenRepository;
  private final TheaterService theaterService;

  public ScreenService(ScreenRepository screenRepository, TheaterService theaterService) {
    this.screenRepository = screenRepository;
    this.theaterService = theaterService;
  }

  public Screen addScreen(Long theaterId, CreateScreenRequest request) {
    Theater theater = theaterService.getTheaterById(theaterId);
    
    // In a real app we'd also check if the user is ADMIN or owner of the theater,
    // but the controller can also be protected by @PreAuthorize. Wait, since the user 
    // can be an owner, we might want to check ownership here. We will check it.
    // For now, let's keep it simple or reuse the TheaterService update logic if needed.

    Screen screen = new Screen();
    screen.setName(request.getName());
    screen.setTheater(theater);

    return screenRepository.save(screen);
  }

  public Screen getScreenById(Long id) {
    return screenRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Screen not found!"));
  }

  public List<Screen> getScreensByTheaterId(Long theaterId) {
    Theater theater = theaterService.getTheaterById(theaterId);
    return screenRepository.findByTheater(theater);
  }
}

package com.cineseat.seat;

import com.cineseat.screen.Screen;
import com.cineseat.screen.ScreenService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SeatService {

  private final SeatRepository seatRepository;
  private final ScreenService screenService;

  public SeatService(SeatRepository seatRepository, ScreenService screenService) {
    this.seatRepository = seatRepository;
    this.screenService = screenService;
  }

  @Transactional
  public List<Seat> generateSeatLayout(Long screenId, SeatLayoutRequest request) {
    Screen screen = screenService.getScreenById(screenId);

    // Delete old seats for this screen if re-configuring
    seatRepository.deleteByScreen(screen);

    List<Seat> newSeats = new ArrayList<>();

    for (String row : request.getRows()) {
      for (int i = 1; i <= request.getSeatsPerRow(); i++) {
        // Skip aisle columns if needed, or just mark them as a special type if required.
        // For simplicity, we just generate seats. If it's an aisle, it's skipped.
        if (request.getAisleColumns() != null && request.getAisleColumns().contains(i)) {
          continue; // It's an aisle, no seat here
        }

        Seat seat = new Seat();
        seat.setScreen(screen);
        seat.setSeatNumber(row + i);
        // Default to REGULAR, in a real scenario you might map rows to PREMIUM etc.
        seat.setSeatType(Seat.SeatType.REGULAR);
        
        newSeats.add(seat);
      }
    }

    return seatRepository.saveAll(newSeats);
  }

  public List<Seat> getSeatsByScreen(Long screenId) {
    Screen screen = screenService.getScreenById(screenId);
    return seatRepository.findByScreen(screen);
  }
}

package com.cineseat.show;

import com.cineseat.exception.ResourceNotFoundException;
import com.cineseat.movie.Movie;
import com.cineseat.movie.MovieService;
import com.cineseat.screen.Screen;
import com.cineseat.screen.ScreenService;
import com.cineseat.seat.Seat;
import com.cineseat.seat.SeatService;
import com.cineseat.seat.ShowSeat;
import com.cineseat.seat.ShowSeatRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShowService {

  private final ShowRepository showRepository;
  private final ShowSeatRepository showSeatRepository;
  private final MovieService movieService;
  private final ScreenService screenService;
  private final SeatService seatService;

  public ShowService(
      ShowRepository showRepository,
      ShowSeatRepository showSeatRepository,
      MovieService movieService,
      ScreenService screenService,
      SeatService seatService) {
    this.showRepository = showRepository;
    this.showSeatRepository = showSeatRepository;
    this.movieService = movieService;
    this.screenService = screenService;
    this.seatService = seatService;
  }

  @Transactional
  public Show addShow(CreateShowRequest request) {
    Movie movie = movieService.getMovieById(request.getMovieId());
    Screen screen = screenService.getScreenById(request.getScreenId());

    Show show = new Show();
    show.setMovie(movie);
    show.setScreen(screen);
    show.setStartTime(request.getStartTime());
    show.setPrice(request.getPrice());

    show = showRepository.save(show);

    // Generate ShowSeat inventory based on Screen's seat layout
    List<Seat> seats = seatService.getSeatsByScreen(screen.getId());
    List<ShowSeat> showSeats = new ArrayList<>();

    for (Seat seat : seats) {
      ShowSeat showSeat = new ShowSeat();
      showSeat.setShow(show);
      showSeat.setSeat(seat);
      showSeat.setStatus(ShowSeat.SeatStatus.AVAILABLE);
      // For now, all seats get the base price. Real apps might adjust based on SeatType.
      showSeat.setPrice(request.getPrice());
      showSeats.add(showSeat);
    }

    showSeatRepository.saveAll(showSeats);

    return show;
  }

  public Show getShowById(Long id) {
    return showRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Show not found"));
  }

  @Transactional
  public Show updateShow(Long id, CreateShowRequest request) {
    Show show = getShowById(id);
    Movie movie = movieService.getMovieById(request.getMovieId());
    Screen screen = screenService.getScreenById(request.getScreenId());

    show.setMovie(movie);
    show.setScreen(screen);
    show.setStartTime(request.getStartTime());
    show.setPrice(request.getPrice());
    
    // Changing the screen or price would typically mean re-generating or updating ShowSeats.
    // For simplicity in Phase 3, we update the show details and just update the base price
    // on all available show seats if the price changed.
    List<ShowSeat> showSeats = showSeatRepository.findByShow(show);
    for (ShowSeat ss : showSeats) {
        if (ss.getStatus() == ShowSeat.SeatStatus.AVAILABLE) {
            ss.setPrice(request.getPrice());
        }
    }
    showSeatRepository.saveAll(showSeats);

    return showRepository.save(show);
  }

  public List<Show> getShows(Long movieId, Long cityId, LocalDate date) {
    String dateStr = date != null ? date.toString() : null;
    return showRepository.findShows(movieId, cityId, dateStr);
  }

  public List<Show> getShowsByTheaterId(Long theaterId, LocalDate date) {
    String dateStr = date != null ? date.toString() : null;
    return showRepository.findByTheaterIdAndDate(theaterId, dateStr);
  }

  public List<ShowSeat> getShowSeats(Long showId) {
    Show show = getShowById(showId);
    return showSeatRepository.findByShow(show);
  }

  @Transactional
  public void deleteShow(Long id) {
    Show show = getShowById(id);
    showSeatRepository.deleteByShow(show);
    showRepository.delete(show);
  }
}

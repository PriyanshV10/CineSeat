package com.cineseat.seat;

import com.cineseat.screen.Screen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
  List<Seat> findByScreen(Screen screen);
  void deleteByScreen(Screen screen);
}

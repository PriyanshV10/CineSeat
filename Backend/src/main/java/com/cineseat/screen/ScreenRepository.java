package com.cineseat.screen;

import com.cineseat.theater.Theater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScreenRepository extends JpaRepository<Screen, Long> {
  List<Screen> findByTheater(Theater theater);
}

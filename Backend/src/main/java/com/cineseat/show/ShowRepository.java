package com.cineseat.show;

import com.cineseat.screen.Screen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {
  List<Show> findByScreen(Screen screen);

  @Query(value = "SELECT s.* FROM show s " +
         "JOIN screen sc ON sc.id = s.screen_id " +
         "JOIN theater t ON t.id = sc.theater_id " +
         "WHERE (:movieId IS NULL OR s.movie_id = :movieId) " +
         "AND (:cityId IS NULL OR t.city_id = :cityId) " +
         "AND (CAST(:dateStr AS text) IS NULL OR DATE(s.start_time) = CAST(:dateStr AS date))", 
         nativeQuery = true)
  List<Show> findShows(@Param("movieId") Long movieId, 
                       @Param("cityId") Long cityId, 
                       @Param("dateStr") String dateStr);

  @Query(value = "SELECT s.* FROM show s " +
         "JOIN screen sc ON sc.id = s.screen_id " +
         "WHERE sc.theater_id = :theaterId " +
         "AND (CAST(:dateStr AS text) IS NULL OR DATE(s.start_time) = CAST(:dateStr AS date))", 
         nativeQuery = true)
  List<Show> findByTheaterIdAndDate(@Param("theaterId") Long theaterId, @Param("dateStr") String dateStr);
}

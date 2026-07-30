package com.cineseat.movie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {
  
  @Query("SELECT m FROM Movie m LEFT JOIN Show s ON s.movie = m LEFT JOIN Booking b ON b.show = s GROUP BY m ORDER BY COUNT(b) DESC")
  List<Movie> findTrendingMovies(org.springframework.data.domain.Pageable pageable);
}

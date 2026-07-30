package com.cineseat.booking;

import com.cineseat.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
  List<Booking> findByStatusAndExpirationTimeBefore(Booking.BookingStatus status, LocalDateTime time);
  List<Booking> findByUser(User user);
}

package com.cineseat.seat;

import com.cineseat.show.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.List;

@Repository
public interface ShowSeatRepository extends JpaRepository<ShowSeat, Long> {
  List<ShowSeat> findByShow(Show show);
  void deleteByShow(Show show);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("SELECT s FROM ShowSeat s WHERE s.id IN :ids")
  List<ShowSeat> findByIdsWithPessimisticWriteLock(@Param("ids") List<Long> ids);
}

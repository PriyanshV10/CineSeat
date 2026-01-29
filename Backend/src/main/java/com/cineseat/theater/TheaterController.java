package com.cineseat.theater;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
public class TheaterController {

    private final TheaterService theaterService;
    public TheaterController(TheaterService theaterService) {
        this.theaterService = theaterService;
    }

    @GetMapping("theaters")
    public List<Theater> getAllTheaters() {
        return theaterService.getAllTheaters();
    }

    @PostMapping("theaters")
    public ResponseEntity<Theater> addTheater(@Valid @RequestBody CreateTheaterRequest request) {
        Theater theater = theaterService.addTheater(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(theater);
    }

    @GetMapping("city/{cityId}/theaters")
    public List<Theater> getTheatersByCity(@PathVariable Long cityId) {
        return theaterService.getTheatersByCityId(cityId);
    }
}

package com.cineseat;

import com.cineseat.movie.Movie;
import com.cineseat.movie.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
public class Test {

    @RequestMapping("/api")
    public String index() {
        return "Hello World!";
    }

}

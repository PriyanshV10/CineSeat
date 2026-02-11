package com.cineseat;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class Home {

  @GetMapping("/api/v1")
  public String index() {
    return "CineSeat API version 1.0!";
  }

  @GetMapping("/")
  public void home(HttpServletResponse response) throws IOException {
    response.sendRedirect("swagger-ui/index.html");
  }
}

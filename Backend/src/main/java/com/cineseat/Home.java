package com.cineseat;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@RestController
public class Home {

  @GetMapping("/api")
  public String index() {
    return "CineSeat API!";
  }

  @GetMapping("/")
  public void home(HttpServletResponse response) throws IOException {
    response.sendRedirect("swagger-ui/index.html");
  }
}

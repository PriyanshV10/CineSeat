package com.cineseat;

import com.cineseat.email.EmailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

  private final EmailService emailService;

  public TestController(EmailService emailService) {
    this.emailService = emailService;
  }

  @GetMapping("/send-test-email")
  public String sendEmail(@RequestParam String email) {

    emailService.sendPasswordResetEmail(email, "Hello World!");

    return "Email sent!";
  }
}

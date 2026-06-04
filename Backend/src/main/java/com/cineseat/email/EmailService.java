package com.cineseat.email;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

  @Value("${resend.api.key}")
  private String apiKey;

  @Value("${frontend.url}")
  private String frontendUrl;

  public void sendPasswordResetEmail(String email, String token) {
    try {
      Resend resend = new Resend(apiKey);
      String resetUrl = frontendUrl + "/reset-password?token=" + token;

      CreateEmailOptions params =
          CreateEmailOptions.builder()
              .from("CineSeat <onboarding@resend.dev>")
              .to(email)
              .subject("Reset Your Password")
              .html(
                  """
                    <h2>Password Reset</h2>
                    <p>Click the link below to reset your password:</p>
                    <a href="%s">Reset Password</a>
                    <p>This link expires in 15 minutes.</p>
                  """
                      .formatted(resetUrl))
              .build();

      resend.emails().send(params);
    } catch (ResendException e) {
      e.printStackTrace();
    }
  }

  public void sendTestEmail(String toEmail) {

    try {

      Resend resend = new Resend(apiKey);

      CreateEmailOptions params =
          CreateEmailOptions.builder()
              .from("onboarding@resend.dev")
              .to(toEmail)
              .subject("Test Email from Spring Boot")
              .html(
                  """
                      <h1>Hello from CineSeat 🚀</h1>
                      <p>This is a test email using Resend.</p>
                  """)
              .build();

      resend.emails().send(params);

      System.out.println("Email sent successfully!");

    } catch (ResendException e) {
      e.printStackTrace();
    }
  }
}

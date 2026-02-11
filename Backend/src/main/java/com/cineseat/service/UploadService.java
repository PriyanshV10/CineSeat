package com.cineseat.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

@Service
public class UploadService {
  @Value("${app.upload.dir}")
  private String uploadDir;

  @Value("${app.upload.url-base}")
  private String urlBase;

  public String store(MultipartFile file) throws IOException {
    String ext =
        Optional.ofNullable(file.getOriginalFilename())
            .filter(n -> n.contains("."))
            .map(n -> n.substring(n.lastIndexOf('.')))
            .orElse("");
    String fileName = UUID.randomUUID() + ext;

    Path target = Paths.get(uploadDir).resolve(fileName).normalize();
    Files.createDirectories(target.getParent());
    Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

    return urlBase + "/" + fileName;
  }
}

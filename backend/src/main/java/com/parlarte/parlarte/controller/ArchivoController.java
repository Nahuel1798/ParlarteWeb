package com.parlarte.parlarte.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/archivos")
@Tag(name = "Archivos", description = "Subida de imágenes (portadas)")
public class ArchivoController {

    private final Path uploadDir;

    public ArchivoController(@Value("${app.uploads.dir:${user.dir}/uploads}") String uploadDir) throws IOException {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.uploadDir);
    }

    @PostMapping("/portada")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Subir imagen de portada",
        description = "Guarda la imagen enviada y devuelve su URL pública.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Imagen subida",
            content = @Content(schema = @Schema(example = "{ \"url\": \"http://localhost:8080/uploads/abc.jpg\" }"))),
        @ApiResponse(responseCode = "400", description = "Archivo vacío o no es una imagen")
    })
    public Map<String, String> subirImagen(
            @RequestParam("archivo") MultipartFile archivo,
            HttpServletRequest request) throws IOException {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("Selecciona una imagen");
        }

        String contentType = archivo.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("El archivo debe ser una imagen");
        }

        String extension = obtenerExtension(archivo.getOriginalFilename());
        String filename = UUID.randomUUID() + extension;
        Path destino = this.uploadDir.resolve(filename);

        try (var in = archivo.getInputStream()) {
            Files.copy(in, destino, StandardCopyOption.REPLACE_EXISTING);
        }

        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        return Map.of("url", baseUrl + "/uploads/" + filename);
    }

    private String obtenerExtension(String originalFilename) {
        if (originalFilename == null) {
            return "";
        }
        int index = originalFilename.lastIndexOf('.');
        if (index == -1) {
            return "";
        }
        String ext = originalFilename.substring(index);
        if (ext.matches("(?i)\\.(jpg|jpeg|png|webp|gif|avif|bmp|svg)")) {
            return ext.toLowerCase();
        }
        return "";
    }
}
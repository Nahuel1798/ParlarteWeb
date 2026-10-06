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
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/archivos")
@Tag(name = "Archivos", description = "Subida de imágenes (portadas) y archivos de clase")
public class ArchivoController {

    private static final Set<String> TIPOS_MP4 = Set.of("video/mp4", "video/m4v", "video/x-m4v");

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

    @PostMapping("/recurso")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Subir un recurso de clase",
        description = "Guarda el archivo enviado (video, material, etc.) y devuelve su URL pública. Requiere rol ADMINISTRADOR o PROFESOR.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Recurso subido",
            content = @Content(schema = @Schema(example = "{ \"url\": \"http://localhost:8080/uploads/abc.mp4\" }"))),
        @ApiResponse(responseCode = "400", description = "Archivo vacío o tipo no permitido")
    })
    public Map<String, String> subirRecurso(
            @RequestParam("archivo") MultipartFile archivo,
            HttpServletRequest request) throws IOException {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("Selecciona un archivo");
        }

        String filename = UUID.randomUUID() + obtenerExtensionRecurso(archivo.getOriginalFilename());
        Path destino = this.uploadDir.resolve(filename);

        try (var in = archivo.getInputStream()) {
            Files.copy(in, destino, StandardCopyOption.REPLACE_EXISTING);
        }

        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        return Map.of("url", baseUrl + "/uploads/" + filename);
    }

    @PostMapping("/video")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Subir un video MP4",
        description = "Guarda el video MP4 enviado y devuelve su URL pública. "
            + "La duración la calcula el cliente y se envia luego al crear el video. "
            + "Requiere rol ADMINISTRADOR o PROFESOR.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Video subido",
            content = @Content(schema = @Schema(example = "{ \"url\": \"http://localhost:8080/uploads/abc.mp4\" }"))),
        @ApiResponse(responseCode = "400", description = "Archivo vacío o el archivo no es un MP4")
    })
    public Map<String, String> subirVideo(
            @RequestParam("archivo") MultipartFile archivo,
            HttpServletRequest request) throws IOException {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("Selecciona un archivo");
        }

        if (!esMp4(archivo)) {
            throw new IllegalArgumentException("El archivo debe ser un video MP4");
        }

        String filename = UUID.randomUUID() + ".mp4";
        Path destino = this.uploadDir.resolve(filename);

        try (var in = archivo.getInputStream()) {
            Files.copy(in, destino, StandardCopyOption.REPLACE_EXISTING);
        }

        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        return Map.of("url", baseUrl + "/uploads/" + filename);
    }

    /**
     * El content-type lo declara el cliente, asi que tambien se exige que el
     * nombre del archivo termine en .mp4 para no confiar en un solo dato.
     */
    private boolean esMp4(MultipartFile archivo) {
        String contentType = archivo.getContentType();
        boolean tipoValido = contentType != null && TIPOS_MP4.contains(contentType.toLowerCase());

        String nombre = archivo.getOriginalFilename();
        boolean nombreValido = nombre != null && nombre.toLowerCase().endsWith(".mp4");

        return tipoValido && nombreValido;
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

    private String obtenerExtensionRecurso(String originalFilename) {
        if (originalFilename == null) {
            return "";
        }
        int index = originalFilename.lastIndexOf('.');
        if (index == -1) {
            return "";
        }
        String ext = originalFilename.substring(index);
        if (ext.matches("(?i)\\.[a-z0-9]{1,8}")) {
            return ext.toLowerCase();
        }
        return "";
    }
}
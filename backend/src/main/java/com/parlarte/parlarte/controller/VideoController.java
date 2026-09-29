package com.parlarte.parlarte.controller;

import com.parlarte.parlarte.dto.VideoRequest;
import com.parlarte.parlarte.dto.VideoResponse;
import com.parlarte.parlarte.service.VideoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos/{cursoId}/clases/{claseId}/videos")
@Tag(name = "Videos", description = "Operaciones CRUD de videos dentro de una clase")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping
    @Operation(summary = "Listar videos de una clase",
            description = "Devuelve los videos de una clase. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "200", description = "Lista de videos obtenida",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = VideoResponse.class))))
    public List<VideoResponse> listar(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            Authentication authentication) {
        return videoService.listarPorClase(cursoId, claseId, authentication.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear un video en una clase",
            description = "Registra un nuevo video dentro de una clase. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "201", description = "Video creado",
            content = @Content(schema = @Schema(implementation = VideoResponse.class)))
    public VideoResponse crear(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            @Valid @RequestBody VideoRequest request,
            Authentication authentication) {
        return videoService.crear(cursoId, claseId, request, authentication.getName());
    }

    @PutMapping("/{videoId}")
    @Operation(summary = "Actualizar un video",
            description = "Actualiza un video existente. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "200", description = "Video actualizado",
            content = @Content(schema = @Schema(implementation = VideoResponse.class)))
    public VideoResponse actualizar(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            @PathVariable Long videoId,
            @Valid @RequestBody VideoRequest request,
            Authentication authentication) {
        return videoService.actualizar(cursoId, claseId, videoId, request, authentication.getName());
    }

    @DeleteMapping("/{videoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar un video",
            description = "Elimina un video existente. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "204", description = "Video eliminado")
    public void eliminar(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            @PathVariable Long videoId,
            Authentication authentication) {
        videoService.eliminar(cursoId, claseId, videoId, authentication.getName());
    }
}
package com.parlarte.parlarte.controller;

import com.parlarte.parlarte.dto.TareaRequest;
import com.parlarte.parlarte.dto.TareaResponse;
import com.parlarte.parlarte.service.TareaService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/cursos/{cursoId}/clases/{claseId}/tareas")
@Tag(name = "Tareas", description = "Operaciones CRUD de tareas dentro de una clase")
public class TareaController {

    private final TareaService tareaService;

    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    @GetMapping
    @Operation(summary = "Listar tareas de una clase",
            description = "Devuelve las tareas de una clase. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "200", description = "Lista de tareas obtenida",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TareaResponse.class))))
    public List<TareaResponse> listar(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            Authentication authentication) {
        return tareaService.listarPorClase(cursoId, claseId, authentication.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear una tarea en una clase",
            description = "Registra una nueva tarea dentro de una clase. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "201", description = "Tarea creada",
            content = @Content(schema = @Schema(implementation = TareaResponse.class)))
    public TareaResponse crear(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            @Valid @RequestBody TareaRequest request,
            Authentication authentication) {
        return tareaService.crear(cursoId, claseId, request, authentication.getName());
    }

    @PutMapping("/{tareaId}")
    @Operation(summary = "Actualizar una tarea",
            description = "Actualiza una tarea existente. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "200", description = "Tarea actualizada",
            content = @Content(schema = @Schema(implementation = TareaResponse.class)))
    public TareaResponse actualizar(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            @PathVariable Long tareaId,
            @Valid @RequestBody TareaRequest request,
            Authentication authentication) {
        return tareaService.actualizar(cursoId, claseId, tareaId, request, authentication.getName());
    }

    @DeleteMapping("/{tareaId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar una tarea",
            description = "Elimina una tarea existente. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "204", description = "Tarea eliminada")
    public void eliminar(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            @PathVariable Long tareaId,
            Authentication authentication) {
        tareaService.eliminar(cursoId, claseId, tareaId, authentication.getName());
    }
}
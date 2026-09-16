package com.parlarte.parlarte.controller;

import com.parlarte.parlarte.dto.ClaseRequest;
import com.parlarte.parlarte.dto.ClaseResponse;
import com.parlarte.parlarte.service.ClaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@Tag(name = "Clases", description = "Operaciones CRUD de clases dentro de un curso")
public class ClaseController {

    private final ClaseService claseService;

    public ClaseController(ClaseService claseService) {
        this.claseService = claseService;
    }

    @GetMapping("/{cursoId}/clases")
    @Operation(summary = "Listar clases de un curso",
            description = "Devuelve las clases de un curso. Requiere el profesor asignado o un administrador.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de clases obtenida",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = ClaseResponse.class)))),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Curso no encontrado con ese id")
    })
    public List<ClaseResponse> listarPorCurso(
            @Parameter(description = "ID del curso", example = "1", required = true)
            @PathVariable Long cursoId,
            Authentication authentication) {
        return claseService.listarPorCurso(cursoId, authentication.getName());
    }

    @PostMapping("/{cursoId}/clases")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear una clase en un curso",
            description = "Registra una nueva clase dentro de un curso. Requiere el profesor asignado o un administrador.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Clase creada",
                    content = @Content(schema = @Schema(implementation = ClaseResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Curso no encontrado con ese id")
    })
    public ClaseResponse crear(
            @Parameter(description = "ID del curso", example = "1", required = true)
            @PathVariable Long cursoId,
            @Valid @RequestBody ClaseRequest request,
            Authentication authentication) {
        return claseService.crear(cursoId, request, authentication.getName());
    }

    @PutMapping("/{cursoId}/clases/{claseId}")
    @Operation(summary = "Actualizar una clase",
            description = "Actualiza una clase existente. Requiere el profesor asignado o un administrador.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Clase actualizada",
                    content = @Content(schema = @Schema(implementation = ClaseResponse.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Clase no encontrada con ese id")
    })
    public ClaseResponse actualizar(
            @Parameter(description = "ID del curso", example = "1", required = true)
            @PathVariable Long cursoId,
            @Parameter(description = "ID de la clase", example = "1", required = true)
            @PathVariable Long claseId,
            @Valid @RequestBody ClaseRequest request,
            Authentication authentication) {
        return claseService.actualizar(claseId, request, authentication.getName());
    }

    @DeleteMapping("/{cursoId}/clases/{claseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar una clase",
            description = "Elimina una clase existente. Requiere el profesor asignado o un administrador.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Clase eliminada"),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Clase no encontrada con ese id")
    })
    public void eliminar(
            @Parameter(description = "ID del curso", example = "1", required = true)
            @PathVariable Long cursoId,
            @Parameter(description = "ID de la clase", example = "1", required = true)
            @PathVariable Long claseId,
            Authentication authentication) {
        claseService.eliminar(claseId, authentication.getName());
    }
}
package com.parlarte.parlarte.controller;

import com.parlarte.parlarte.dto.EventoRequest;
import com.parlarte.parlarte.dto.EventoResponse;
import com.parlarte.parlarte.service.EventoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@Tag(name = "Eventos", description = "Calendario de eventos de cursos, con operaciones CRUD")
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @GetMapping
    @Operation(summary = "Listar eventos de un rango de fechas",
            description = "Devuelve los eventos activos entre las fechas indicadas. Los administradores ven todos los eventos; "
                    + "los profesores ven los de sus cursos y los alumnos los de los cursos en los que están inscritos. "
                    + "Los eventos sin curso asociado son visibles para todos los roles.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de eventos obtenida",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = EventoResponse.class)))),
            @ApiResponse(responseCode = "400", description = "El rango de fechas es inválido"),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido")
    })
    public List<EventoResponse> listar(
            @Parameter(description = "Inicio del rango en formato ISO, por ejemplo 2026-09-01T00:00:00", example = "2026-09-01T00:00:00", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @Parameter(description = "Fin del rango en formato ISO. No puede superar los 366 días", example = "2026-10-01T00:00:00", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            Authentication authentication) {
        return eventoService.listar(desde, hasta, authentication.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear un evento",
            description = "Registra un evento en el calendario. Requiere el profesor asignado a un curso o un administrador. "
                    + "Los eventos sin curso solo puede crearlos un administrador.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Evento creado",
                    content = @Content(schema = @Schema(implementation = EventoResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol o curso insuficiente"),
            @ApiResponse(responseCode = "404", description = "Curso o clase no encontrada con ese id")
    })
    public EventoResponse crear(
            @Valid @RequestBody EventoRequest request,
            Authentication authentication) {
        return eventoService.crear(request, authentication.getName());
    }

    @PutMapping("/{eventoId}")
    @Operation(summary = "Actualizar un evento",
            description = "Actualiza un evento del calendario. Requiere el profesor asignado al curso del evento o un administrador.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Evento actualizado",
                    content = @Content(schema = @Schema(implementation = EventoResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol o curso insuficiente"),
            @ApiResponse(responseCode = "404", description = "Evento, curso o clase no encontrado con ese id")
    })
    public EventoResponse actualizar(
            @Parameter(description = "ID del evento", example = "1", required = true)
            @PathVariable Long eventoId,
            @Valid @RequestBody EventoRequest request,
            Authentication authentication) {
        return eventoService.actualizar(eventoId, request, authentication.getName());
    }

    @DeleteMapping("/{eventoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar un evento",
            description = "Elimina un evento del calendario. Requiere el profesor asignado al curso del evento o un administrador.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Evento eliminado"),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol o curso insuficiente"),
            @ApiResponse(responseCode = "404", description = "Evento no encontrado con ese id")
    })
    public void eliminar(
            @Parameter(description = "ID del evento", example = "1", required = true)
            @PathVariable Long eventoId,
            Authentication authentication) {
        eventoService.eliminar(eventoId, authentication.getName());
    }
}

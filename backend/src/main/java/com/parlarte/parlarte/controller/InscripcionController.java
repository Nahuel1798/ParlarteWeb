package com.parlarte.parlarte.controller;

import com.parlarte.parlarte.dto.InscripcionRequest;
import com.parlarte.parlarte.dto.InscripcionResponse;
import com.parlarte.parlarte.service.InscripcionService;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscripciones")
@Tag(name = "Inscripciones", description = "Operaciones CRUD de inscripciones de alumnos a cursos")
public class InscripcionController {

    private final InscripcionService inscripcionService;

    public InscripcionController(InscripcionService inscripcionService) {
        this.inscripcionService = inscripcionService;
    }

    @GetMapping
    @Operation(summary = "Listar todas las inscripciones",
            description = "Devuelve todas las inscripciones registradas. Requiere rol ADMINISTRADOR o PROFESOR.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de inscripciones obtenida",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = InscripcionResponse.class)))),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente")
    })
    public List<InscripcionResponse> listar() {
        return inscripcionService.listarTodos();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar inscripción por ID",
            description = "Devuelve una inscripción según su identificador. Requiere rol ADMINISTRADOR o PROFESOR.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Inscripción encontrada",
                    content = @Content(schema = @Schema(implementation = InscripcionResponse.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Inscripción no encontrada con ese id")
    })
    public InscripcionResponse buscarPorId(
            @Parameter(description = "ID de la inscripción", example = "1", required = true)
            @PathVariable Long id) {
        return inscripcionService.buscarPorId(id);
    }

    @GetMapping("/alumno/{alumnoId}")
    @Operation(summary = "Listar inscripciones por ID de alumno",
            description = "Devuelve todas las inscripciones de un alumno según su identificador. Requiere rol ADMINISTRADOR, PROFESOR o el propio ALUMNO.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de inscripciones obtenida",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = InscripcionResponse.class)))),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Alumno no encontrado con ese id")
    })
    public List<InscripcionResponse> listarPorAlumno(
            @Parameter(description = "ID del alumno", example = "1", required = true)
            @PathVariable Long alumnoId) {
        return inscripcionService.listarPorAlumno(alumnoId);
    }

    @PostMapping
    @Operation(summary = "Crear una nueva inscripción",
            description = "Crea una nueva inscripción de un alumno a un curso. Requiere rol ADMINISTRADOR, PROFESOR o el propio ALUMNO.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Inscripción creada",
                    content = @Content(schema = @Schema(implementation = InscripcionResponse.class))),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida: datos incompletos o incorrectos"),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Alumno o curso no encontrado con ese id")
    })
    public InscripcionResponse crear(
            @Parameter(description = "Datos de la inscripción", required = true)
            @Valid @RequestBody InscripcionRequest inscripcionRequest) {
        return inscripcionService.crear(inscripcionRequest);
    }
    
    @PutMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar una inscripción",
            description = "Cancela una inscripción existente. Requiere rol ADMINISTRADOR, PROFESOR o el propio ALUMNO.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Inscripción cancelada",
                    content = @Content(schema = @Schema(implementation = InscripcionResponse.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Inscripción no encontrada con ese id")
    })
    public InscripcionResponse cancelar(
            @Parameter(description = "ID de la inscripción", example = "1", required = true)
            @PathVariable Long id) {
        return inscripcionService.cancelar(id); 
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una inscripción",
            description = "Elimina una inscripción existente. Requiere rol ADMINISTRADOR.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Inscripción eliminada"),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Inscripción no encontrada con ese id")
    })
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(
            @Parameter(description = "ID de la inscripción", example = "1", required = true)
            @PathVariable Long id) {
        inscripcionService.eliminar(id);
    }
}

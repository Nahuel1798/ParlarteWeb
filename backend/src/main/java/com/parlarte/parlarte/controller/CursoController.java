package com.parlarte.parlarte.controller;

import com.parlarte.parlarte.entity.Curso;
import com.parlarte.parlarte.service.CursoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
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

import java.util.List;

@RestController 
@RequestMapping("/api/cursos")
@Tag(name = "Cursos", description = "Operaciones CRUD de cursos")
public class CursoController {

    private final CursoService cursoService;

    public CursoController(CursoService cursoService) {
        this.cursoService = cursoService;
    }

        @GetMapping
        @Operation(summary = "Listar todos los cursos",
            description = "Devuelve todos los cursos registrados.")
        @ApiResponse(responseCode = "200", description = "Lista de cursos obtenida",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Curso.class))))
        public List<Curso> listar() {
        return cursoService.listarTodos();
        }

        @GetMapping("/{id}")
        @Operation(summary = "Buscar curso por ID",
            description = "Devuelve un curso según su identificador.")
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Curso encontrado",
                content = @Content(schema = @Schema(implementation = Curso.class))),
            @ApiResponse(responseCode = "404", description = "Curso no encontrado con ese id")
        })
        public Curso buscarPorId(
            @Parameter(description = "ID del curso", example = "1", required = true)
            @PathVariable Long id) {
        return cursoService.buscarPorId(id);
        }

        @GetMapping("/buscar")
        @Operation(summary = "Buscar cursos por nombre",
            description = "Devuelve los cursos cuyo nombre contiene el texto indicado.")
        @ApiResponse(responseCode = "200", description = "Cursos encontrados",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Curso.class))))
        public List<Curso> buscarPorNombre(
            @Parameter(description = "Texto que debe contener el nombre", example = "español", required = true)
            @RequestParam String nombre) {
        return cursoService.buscarPorNombre(nombre);
        }

        @GetMapping("/nombre")
        @Operation(summary = "Buscar curso por nombre exacto",
            description = "Devuelve el curso cuyo nombre coincide exactamente.")
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Curso encontrado",
                content = @Content(schema = @Schema(implementation = Curso.class))),
            @ApiResponse(responseCode = "404", description = "Curso no encontrado con ese nombre")
        })
        public Curso buscarPorNombreExacto(
            @Parameter(description = "Nombre exacto del curso", example = "Español A1", required = true)
            @RequestParam String nombre) {
        return cursoService.buscarPorNombreExacto(nombre);
        }

        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        @Operation(summary = "Crear un curso", description = "Registra un nuevo curso.")
        @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Curso creado",
                content = @Content(schema = @Schema(implementation = Curso.class))),
            @ApiResponse(responseCode = "409", description = "Ya existe un curso con ese nombre")
        })
        public Curso crear(@RequestBody Curso curso) {
        return cursoService.crear(curso);
        }

        @PutMapping("/{id}")
        @Operation(summary = "Actualizar un curso", description = "Actualiza un curso existente.")
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Curso actualizado",
                content = @Content(schema = @Schema(implementation = Curso.class))),
            @ApiResponse(responseCode = "404", description = "Curso no encontrado con ese id"),
            @ApiResponse(responseCode = "409", description = "Ya existe un curso con ese nombre")
        })
        public Curso actualizar(
            @Parameter(description = "ID del curso", example = "1", required = true)
            @PathVariable Long id,
            @RequestBody Curso curso) {
        return cursoService.actualizar(id, curso);
        }

        @DeleteMapping("/{id}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        @Operation(summary = "Eliminar un curso", description = "Elimina un curso existente.")
        @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Curso eliminado"),
            @ApiResponse(responseCode = "404", description = "Curso no encontrado con ese id")
        })
        public void eliminar(
            @Parameter(description = "ID del curso", example = "1", required = true)
            @PathVariable Long id) {
        cursoService.eliminar(id);
        }
}

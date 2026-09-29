package com.parlarte.parlarte.controller;

import com.parlarte.parlarte.dto.TestRequest;
import com.parlarte.parlarte.dto.TestResponse;
import com.parlarte.parlarte.service.TestService;
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
@RequestMapping("/api/cursos/{cursoId}/clases/{claseId}/tests")
@Tag(name = "Tests", description = "Operaciones CRUD de tests con preguntas dentro de una clase")
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping
    @Operation(summary = "Listar tests de una clase",
            description = "Devuelve los tests de una clase con sus preguntas y respuestas. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "200", description = "Lista de tests obtenida",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TestResponse.class))))
    public List<TestResponse> listar(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            Authentication authentication) {
        return testService.listarPorClase(cursoId, claseId, authentication.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear un test en una clase",
            description = "Registra un nuevo test con sus preguntas y respuestas. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "201", description = "Test creado",
            content = @Content(schema = @Schema(implementation = TestResponse.class)))
    public TestResponse crear(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            @Valid @RequestBody TestRequest request,
            Authentication authentication) {
        return testService.crear(cursoId, claseId, request, authentication.getName());
    }

    @PutMapping("/{testId}")
    @Operation(summary = "Actualizar un test",
            description = "Reemplaza las preguntas y respuestas de un test existente. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "200", description = "Test actualizado",
            content = @Content(schema = @Schema(implementation = TestResponse.class)))
    public TestResponse actualizar(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            @PathVariable Long testId,
            @Valid @RequestBody TestRequest request,
            Authentication authentication) {
        return testService.actualizar(cursoId, claseId, testId, request, authentication.getName());
    }

    @DeleteMapping("/{testId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar un test",
            description = "Elimina un test con sus preguntas y respuestas. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "204", description = "Test eliminado")
    public void eliminar(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            @PathVariable Long testId,
            Authentication authentication) {
        testService.eliminar(cursoId, claseId, testId, authentication.getName());
    }
}
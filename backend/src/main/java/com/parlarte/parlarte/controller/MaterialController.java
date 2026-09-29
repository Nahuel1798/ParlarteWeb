package com.parlarte.parlarte.controller;

import com.parlarte.parlarte.dto.MaterialRequest;
import com.parlarte.parlarte.dto.MaterialResponse;
import com.parlarte.parlarte.service.MaterialService;
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
@RequestMapping("/api/cursos/{cursoId}/clases/{claseId}/materiales")
@Tag(name = "Materiales", description = "Operaciones CRUD de materiales dentro de una clase")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping
    @Operation(summary = "Listar materiales de una clase",
            description = "Devuelve los materiales de una clase. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "200", description = "Lista de materiales obtenida",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = MaterialResponse.class))))
    public List<MaterialResponse> listar(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            Authentication authentication) {
        return materialService.listarPorClase(cursoId, claseId, authentication.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear un material en una clase",
            description = "Registra un nuevo material dentro de una clase. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "201", description = "Material creado",
            content = @Content(schema = @Schema(implementation = MaterialResponse.class)))
    public MaterialResponse crear(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            @Valid @RequestBody MaterialRequest request,
            Authentication authentication) {
        return materialService.crear(cursoId, claseId, request, authentication.getName());
    }

    @PutMapping("/{materialId}")
    @Operation(summary = "Actualizar un material",
            description = "Actualiza un material existente. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "200", description = "Material actualizado",
            content = @Content(schema = @Schema(implementation = MaterialResponse.class)))
    public MaterialResponse actualizar(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            @PathVariable Long materialId,
            @Valid @RequestBody MaterialRequest request,
            Authentication authentication) {
        return materialService.actualizar(cursoId, claseId, materialId, request, authentication.getName());
    }

    @DeleteMapping("/{materialId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar un material",
            description = "Elimina un material existente. Requiere el profesor asignado o un administrador.")
    @ApiResponse(responseCode = "204", description = "Material eliminado")
    public void eliminar(
            @PathVariable Long cursoId,
            @PathVariable Long claseId,
            @PathVariable Long materialId,
            Authentication authentication) {
        materialService.eliminar(cursoId, claseId, materialId, authentication.getName());
    }
}
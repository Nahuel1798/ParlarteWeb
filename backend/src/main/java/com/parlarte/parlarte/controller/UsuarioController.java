package com.parlarte.parlarte.controller;

import com.parlarte.parlarte.dto.UsuarioRequest;
import com.parlarte.parlarte.dto.UsuarioResponse;
import com.parlarte.parlarte.entity.Usuario;
import com.parlarte.parlarte.service.UsuarioService;
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
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Operaciones CRUD de usuarios de la plataforma")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @Operation(summary = "Listar todos los usuarios",
            description = "Devuelve todos los usuarios registrados. Requiere rol ADMINISTRADOR o PROFESOR.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = UsuarioResponse.class)))),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente")
    })
    public List<UsuarioResponse> listar() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/rol/{rol}")
    @Operation(summary = "Listar usuarios por rol",
            description = "Devuelve los usuarios según su rol. Requiere rol ADMINISTRADOR o PROFESOR.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = UsuarioResponse.class)))),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente")
    })
    public List<UsuarioResponse> listarPorRol(
            @Parameter(description = "Rol del usuario: ADMINISTRADOR, PROFESOR o ALUMNO", example = "ALUMNO", required = true)
            @PathVariable Usuario.Rol rol) {
        return usuarioService.listarPorRol(rol);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar usuario por ID",
            description = "Devuelve un usuario según su identificador. Requiere rol ADMINISTRADOR o PROFESOR.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario encontrado",
                    content = @Content(schema = @Schema(implementation = UsuarioResponse.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado con ese id")
    })
    public UsuarioResponse buscarPorId(
            @Parameter(description = "ID del usuario", example = "1", required = true)
            @PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    @GetMapping("/email")
    @Operation(summary = "Buscar usuario por email",
            description = "Devuelve un usuario según su email. Requiere rol ADMINISTRADOR o PROFESOR.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario encontrado",
                    content = @Content(schema = @Schema(implementation = UsuarioResponse.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado con ese email")
    })
    public UsuarioResponse buscarPorEmail(
            @Parameter(description = "Email del usuario", example = "alumno@parlarte.com", required = true)
            @RequestParam String email) {
        return usuarioService.buscarPorEmail(email);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear un usuario",
            description = "Registra un nuevo usuario. Endpoint público, no requiere autenticación.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuario creado",
                    content = @Content(schema = @Schema(implementation = UsuarioResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos (nombre, email, contraseña o rol)"),
            @ApiResponse(responseCode = "409", description = "Ya existe un usuario con ese email")
    })
    public UsuarioResponse crear(@Valid @RequestBody UsuarioRequest request) {
        return usuarioService.crear(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un usuario",
            description = "Actualiza los datos de un usuario existente. Requiere rol ADMINISTRADOR.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario actualizado",
                    content = @Content(schema = @Schema(implementation = UsuarioResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado con ese id"),
            @ApiResponse(responseCode = "409", description = "Ya existe un usuario con ese email")
    })
    public UsuarioResponse actualizar(
            @Parameter(description = "ID del usuario", example = "1", required = true)
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRequest request) {
        return usuarioService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar un usuario",
            description = "Elimina un usuario existente. Requiere rol ADMINISTRADOR.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Usuario eliminado"),
            @ApiResponse(responseCode = "401", description = "No autenticado: token requerido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado: rol insuficiente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado con ese id"),
            @ApiResponse(responseCode = "409", description = "No se puede eliminar: tiene datos asociados")
    })
    public void eliminar(
            @Parameter(description = "ID del usuario", example = "1", required = true)
            @PathVariable Long id) {
        usuarioService.eliminar(id);
    }
}
package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Usuario;

/**
 * Datos públicos del usuario autenticado. Los tokens ya no viajan en el cuerpo:
 * se entregan en cookies httpOnly.
 */
public class LoginResponse {

    private String email;
    private String nombre;
    private Usuario.Rol rol;
    private Long id;

    public LoginResponse() {
    }

    public LoginResponse(String email, String nombre, Usuario.Rol rol, Long id) {
        this.email = email;
        this.nombre = nombre;
        this.rol = rol;
        this.id = id;
    }

    public static LoginResponse desde(Usuario usuario) {
        return new LoginResponse(usuario.getEmail(), usuario.getNombre(), usuario.getRol(), usuario.getId());
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Usuario.Rol getRol() {
        return rol;
    }

    public void setRol(Usuario.Rol rol) {
        this.rol = rol;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}

package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Usuario;

import java.time.LocalDateTime;

public class UsuarioResponse {

    private Long id;
    private String nombre;
    private String apellidos;
    private String email;
    private Usuario.Rol rol;
    private Usuario.Nivel nivel;
    private LocalDateTime fechaCreacion;

    public static UsuarioResponse fromEntity(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.id = usuario.getId();
        response.nombre = usuario.getNombre();
        response.apellidos = usuario.getApellidos();
        response.email = usuario.getEmail();
        response.rol = usuario.getRol();
        response.nivel = usuario.getNivel();
        response.fechaCreacion = usuario.getFechaCreacion();
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Usuario.Rol getRol() {
        return rol;
    }

    public void setRol(Usuario.Rol rol) {
        this.rol = rol;
    }

    public Usuario.Nivel getNivel() {
        return nivel;
    }

    public void setNivel(Usuario.Nivel nivel) {
        this.nivel = nivel;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
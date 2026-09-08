package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Usuario;

public class LoginResponse {

    private String token;
    private String tipo;
    private String email;
    private String nombre;
    private Usuario.Rol rol;
    private Long id;

    public LoginResponse() {
    }

    public LoginResponse(String token, String tipo, String email, String nombre, Usuario.Rol rol, Long id) {
        this.token = token;
        this.tipo = tipo;
        this.email = email;
        this.nombre = nombre;
        this.rol = rol;
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
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
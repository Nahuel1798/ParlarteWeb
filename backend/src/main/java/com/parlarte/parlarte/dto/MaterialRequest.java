package com.parlarte.parlarte.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MaterialRequest {

    @NotBlank(message = "El título del material es obligatorio")
    @Size(max = 100, message = "El título no puede superar los 100 caracteres")
    private String titulo;

    @NotBlank(message = "El tipo de material es obligatorio")
    @Size(max = 100, message = "El tipo no puede superar los 100 caracteres")
    private String tipo;

    @NotBlank(message = "La URL del material es obligatoria")
    @Size(max = 500, message = "La URL no puede superar los 500 caracteres")
    private String url;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
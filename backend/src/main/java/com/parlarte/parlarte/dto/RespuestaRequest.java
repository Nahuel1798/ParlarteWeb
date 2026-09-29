package com.parlarte.parlarte.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RespuestaRequest {

    @NotBlank(message = "El texto de la respuesta es obligatorio")
    @Size(max = 500, message = "El texto no puede superar los 500 caracteres")
    private String texto;

    private Boolean correcta = false;

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public Boolean getCorrecta() {
        return correcta;
    }

    public void setCorrecta(Boolean correcta) {
        this.correcta = correcta;
    }
}
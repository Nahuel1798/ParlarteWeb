package com.parlarte.parlarte.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class PreguntaRequest {

    @NotBlank(message = "El enunciado de la pregunta es obligatorio")
    @Size(max = 500, message = "El enunciado no puede superar los 500 caracteres")
    private String enunciado;

    @NotNull(message = "La pregunta debe tener al menos una respuesta")
    @Size(min = 1, message = "La pregunta debe tener al menos una respuesta")
    private List<RespuestaRequest> respuestas = new ArrayList<>();

    public String getEnunciado() {
        return enunciado;
    }

    public void setEnunciado(String enunciado) {
        this.enunciado = enunciado;
    }

    public List<RespuestaRequest> getRespuestas() {
        return respuestas;
    }

    public void setRespuestas(List<RespuestaRequest> respuestas) {
        this.respuestas = respuestas;
    }
}
package com.parlarte.parlarte.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class TestRequest {

    @NotBlank(message = "El título del test es obligatorio")
    @Size(max = 100, message = "El título no puede superar los 100 caracteres")
    private String titulo;

    @NotBlank(message = "El porcentaje de aprobación es obligatorio")
    @Size(max = 100, message = "El porcentaje no puede superar los 100 caracteres")
    private String porcentajeAprobacion;

    private List<PreguntaRequest> preguntas = new ArrayList<>();

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getPorcentajeAprobacion() {
        return porcentajeAprobacion;
    }

    public void setPorcentajeAprobacion(String porcentajeAprobacion) {
        this.porcentajeAprobacion = porcentajeAprobacion;
    }

    public List<PreguntaRequest> getPreguntas() {
        return preguntas;
    }

    public void setPreguntas(List<PreguntaRequest> preguntas) {
        this.preguntas = preguntas;
    }
}
package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Test;

import java.util.List;
import java.util.stream.Collectors;

public class TestResponse {

    private Long id;
    private String titulo;
    private String porcentajeAprobacion;
    private Long claseId;
    private List<PreguntaResponse> preguntas;

    public static TestResponse fromEntity(Test test) {
        TestResponse response = new TestResponse();
        response.id = test.getId();
        response.titulo = test.getTitulo();
        response.porcentajeAprobacion = test.getPorcentajeAprobacion();
        response.claseId = test.getClase().getId();
        response.preguntas = test.getPreguntas().stream()
                .map(PreguntaResponse::fromEntity)
                .collect(Collectors.toList());
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getPorcentajeAprobacion() {
        return porcentajeAprobacion;
    }

    public Long getClaseId() {
        return claseId;
    }

    public List<PreguntaResponse> getPreguntas() {
        return preguntas;
    }
}
package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Pregunta;

import java.util.List;
import java.util.stream.Collectors;

public class PreguntaResponse {

    private Long id;
    private String enunciado;
    private List<RespuestaResponse> respuestas;

    public static PreguntaResponse fromEntity(Pregunta pregunta) {
        PreguntaResponse response = new PreguntaResponse();
        response.id = pregunta.getId();
        response.enunciado = pregunta.getEnunciado();
        response.respuestas = pregunta.getRespuestas().stream()
                .map(RespuestaResponse::fromEntity)
                .collect(Collectors.toList());
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getEnunciado() {
        return enunciado;
    }

    public List<RespuestaResponse> getRespuestas() {
        return respuestas;
    }
}
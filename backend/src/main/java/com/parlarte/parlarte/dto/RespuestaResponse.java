package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Pregunta;
import com.parlarte.parlarte.entity.Respuesta;

import java.util.List;
import java.util.stream.Collectors;

public class RespuestaResponse {

    private Long id;
    private String texto;
    private Boolean correcta;

    public static RespuestaResponse fromEntity(Respuesta respuesta) {
        RespuestaResponse response = new RespuestaResponse();
        response.id = respuesta.getId();
        response.texto = respuesta.getTexto();
        response.correcta = respuesta.getCorrecta();
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getTexto() {
        return texto;
    }

    public Boolean getCorrecta() {
        return correcta;
    }
}
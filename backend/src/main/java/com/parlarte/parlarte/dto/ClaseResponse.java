package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Clase;

public class ClaseResponse {

    private Long id;
    private String titulo;
    private String descripcion;
    private Integer modulo;
    private Long cursoId;

    public static ClaseResponse fromEntity(Clase clase) {
        ClaseResponse response = new ClaseResponse();
        response.id = clase.getId();
        response.titulo = clase.getTitulo();
        response.descripcion = clase.getDescripcion();
        response.modulo = clase.getModulo();
        response.cursoId = clase.getCurso().getId();
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Integer getModulo() {
        return modulo;
    }

    public Long getCursoId() {
        return cursoId;
    }
}
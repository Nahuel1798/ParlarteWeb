package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Material;

public class MaterialResponse {

    private Long id;
    private String titulo;
    private String tipo;
    private String url;
    private Long claseId;

    public static MaterialResponse fromEntity(Material material) {
        MaterialResponse response = new MaterialResponse();
        response.id = material.getId();
        response.titulo = material.getTitulo();
        response.tipo = material.getTipo();
        response.url = material.getUrl();
        response.claseId = material.getClase().getId();
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getTipo() {
        return tipo;
    }

    public String getUrl() {
        return url;
    }

    public Long getClaseId() {
        return claseId;
    }
}
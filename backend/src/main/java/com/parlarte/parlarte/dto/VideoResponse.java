package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Videos;

public class VideoResponse {

    private Long id;
    private String titulo;
    private String url;
    private Integer duracionSegundos;
    private Long claseId;

    public static VideoResponse fromEntity(Videos video) {
        VideoResponse response = new VideoResponse();
        response.id = video.getId();
        response.titulo = video.getTitulo();
        response.url = video.getUrl();
        response.duracionSegundos = video.getDuracionSegundos();
        response.claseId = video.getClase().getId();
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getUrl() {
        return url;
    }

    public Integer getDuracionSegundos() {
        return duracionSegundos;
    }

    public Long getClaseId() {
        return claseId;
    }
}
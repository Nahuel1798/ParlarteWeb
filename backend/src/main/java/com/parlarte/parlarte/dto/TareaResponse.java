package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Tarea;

import java.time.LocalDateTime;

public class TareaResponse {

    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaEntrega;
    private Long claseId;

    public static TareaResponse fromEntity(Tarea tarea) {
        TareaResponse response = new TareaResponse();
        response.id = tarea.getId();
        response.titulo = tarea.getTitulo();
        response.descripcion = tarea.getDescripcion();
        response.fechaEntrega = tarea.getFechaEntrega();
        response.claseId = tarea.getClase().getId();
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

    public LocalDateTime getFechaEntrega() {
        return fechaEntrega;
    }

    public Long getClaseId() {
        return claseId;
    }
}
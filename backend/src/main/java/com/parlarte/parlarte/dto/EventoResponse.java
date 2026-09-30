package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Evento;

import java.time.LocalDateTime;

public class EventoResponse {

    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDateTime fecha;
    private Integer duracionMinutos;
    private String tipo;
    private Boolean activo;
    private Long cursoId;
    private String cursoNombre;
    private Long claseId;
    private String claseTitulo;

    public static EventoResponse fromEntity(Evento evento) {
        EventoResponse response = new EventoResponse();
        response.id = evento.getId();
        response.titulo = evento.getTitulo();
        response.descripcion = evento.getDescripcion();
        response.fecha = evento.getFecha();
        response.duracionMinutos = evento.getDuracionMinutos();
        response.tipo = evento.getTipo() != null ? evento.getTipo().name() : null;
        response.activo = evento.getActivo();
        response.cursoId = evento.getCurso() != null ? evento.getCurso().getId() : null;
        response.cursoNombre = evento.getCurso() != null ? evento.getCurso().getNombre() : null;
        response.claseId = evento.getClase() != null ? evento.getClase().getId() : null;
        response.claseTitulo = evento.getClase() != null ? evento.getClase().getTitulo() : null;
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

    public LocalDateTime getFecha() {
        return fecha;
    }

    public Integer getDuracionMinutos() {
        return duracionMinutos;
    }

    public String getTipo() {
        return tipo;
    }

    public Boolean getActivo() {
        return activo;
    }

    public Long getCursoId() {
        return cursoId;
    }

    public String getCursoNombre() {
        return cursoNombre;
    }

    public Long getClaseId() {
        return claseId;
    }

    public String getClaseTitulo() {
        return claseTitulo;
    }
}

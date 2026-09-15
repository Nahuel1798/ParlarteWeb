package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Inscripcion;

import java.time.LocalDateTime;

public class InscripcionResponse {

    private Long id;
    private Long alumnoId;
    private String alumnoNombre;
    private Long cursoId;
    private String cursoNombre;
    private LocalDateTime fechaInscripcion;
    private Boolean activa;

    public static InscripcionResponse fromEntity(Inscripcion inscripcion) {
        InscripcionResponse response = new InscripcionResponse();
        response.id = inscripcion.getId();
        response.alumnoId = inscripcion.getAlumno().getId();
        response.alumnoNombre = inscripcion.getAlumno().getNombre();
        response.cursoId = inscripcion.getCurso().getId();
        response.cursoNombre = inscripcion.getCurso().getNombre();
        response.fechaInscripcion = inscripcion.getFechaInscripcion();
        response.activa = inscripcion.getActiva();
        return response;
    }

    public Long getId() {
        return id;
    }

    public Long getAlumnoId() {
        return alumnoId;
    }

    public String getAlumnoNombre() {
        return alumnoNombre;
    }

    public Long getCursoId() {
        return cursoId;
    }

    public String getCursoNombre() {
        return cursoNombre;
    }

    public LocalDateTime getFechaInscripcion() {
        return fechaInscripcion;
    }

    public Boolean getActiva() {
        return activa;
    }
}
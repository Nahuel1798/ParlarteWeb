package com.parlarte.parlarte.dto;

import com.parlarte.parlarte.entity.Evento;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class EventoRequest {

    @NotBlank(message = "El título del evento es obligatorio")
    @Size(max = 100, message = "El título no puede superar los 100 caracteres")
    private String titulo;

    @Size(max = 500, message = "La descripción no puede superar los 500 caracteres")
    private String descripcion;

    @NotNull(message = "La fecha del evento es obligatoria")
    private LocalDateTime fecha;

    @NotNull(message = "La duración es obligatoria")
    @Min(value = 5, message = "La duración mínima es de 5 minutos")
    @Max(value = 1440, message = "La duración máxima es de 1440 minutos")
    private Integer duracionMinutos = 60;

    @NotNull(message = "El tipo de evento es obligatorio")
    private Evento.TipoEvento tipo = Evento.TipoEvento.OTRO;

    private Long cursoId;

    private Long claseId;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Integer getDuracionMinutos() {
        return duracionMinutos;
    }

    public void setDuracionMinutos(Integer duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }

    public Evento.TipoEvento getTipo() {
        return tipo;
    }

    public void setTipo(Evento.TipoEvento tipo) {
        this.tipo = tipo;
    }

    public Long getCursoId() {
        return cursoId;
    }

    public void setCursoId(Long cursoId) {
        this.cursoId = cursoId;
    }

    public Long getClaseId() {
        return claseId;
    }

    public void setClaseId(Long claseId) {
        this.claseId = claseId;
    }
}

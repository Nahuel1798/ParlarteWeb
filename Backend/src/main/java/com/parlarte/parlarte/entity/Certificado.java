package com.parlarte.parlarte.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "certificados")
public class Certificado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @ManyToOne
    @JoinColumn(name = "alumno_id", nullable = false)
    private Usuario alumno;

    @ManyToOne
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaEmision;

    @PrePersist
    protected void onCreate() {
        codigo = UUID.randomUUID().toString().replace("-", "").toUpperCase();
        fechaEmision = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Usuario getAlumno() {
        return alumno;
    }

    public void setAlumno(Usuario alumno) {
        this.alumno = alumno;
    }

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }

    public LocalDateTime getFechaEmision() {
        return fechaEmision;
    }
}
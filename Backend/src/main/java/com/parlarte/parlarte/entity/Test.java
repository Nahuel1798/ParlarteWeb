package com.parlarte.parlarte.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "test")
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(nullable = false, length = 100)
    private String porcentajeAprobacion;

    @ManyToOne
    @JoinColumn(name = "clase_id", nullable = false)
    private Clase clase;

    @OneToMany(mappedBy = "test")
    private List<Pregunta> preguntas = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getPorcentajeAprobacion() {
        return porcentajeAprobacion;
    }

    public void setPorcentajeAprobacion(String porcentajeAprobacion) {
        this.porcentajeAprobacion = porcentajeAprobacion;
    }

    public Clase getClase() {
        return clase;
    }

    public void setClase(Clase clase) {
        this.clase = clase;
    }

    public List<Pregunta> getPreguntas() {
        return preguntas;
    }

    public void setPreguntas(List<Pregunta> preguntas) {
        this.preguntas = preguntas;
    }
}
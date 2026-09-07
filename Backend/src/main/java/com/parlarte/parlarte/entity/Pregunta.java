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
@Table(name = "preguntas")
public class Pregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String enunciado;

    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    @OneToMany(mappedBy = "pregunta")
    private List<Respuesta> respuestas = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEnunciado() {
        return enunciado;
    }

    public void setEnunciado(String enunciado) {
        this.enunciado = enunciado;
    }

    public Test getTest() {
        return test;
    }

    public void setTest(Test test) {
        this.test = test;
    }

    public List<Respuesta> getRespuestas() {
        return respuestas;
    }

    public void setRespuestas(List<Respuesta> respuestas) {
        this.respuestas = respuestas;
    }
}
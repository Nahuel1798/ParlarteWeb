package com.parlarte.parlarte.dto;

public class CursoResumenResponse {

    private Long cursoId;
    private long modulos;
    private long clases;
    private long videos;
    private long materiales;
    private long tareas;
    private long tests;

    public Long getCursoId() {
        return cursoId;
    }

    public void setCursoId(Long cursoId) {
        this.cursoId = cursoId;
    }

    public long getModulos() {
        return modulos;
    }

    public void setModulos(long modulos) {
        this.modulos = modulos;
    }

    public long getClases() {
        return clases;
    }

    public void setClases(long clases) {
        this.clases = clases;
    }

    public long getVideos() {
        return videos;
    }

    public void setVideos(long videos) {
        this.videos = videos;
    }

    public long getMateriales() {
        return materiales;
    }

    public void setMateriales(long materiales) {
        this.materiales = materiales;
    }

    public long getTareas() {
        return tareas;
    }

    public void setTareas(long tareas) {
        this.tareas = tareas;
    }

    public long getTests() {
        return tests;
    }

    public void setTests(long tests) {
        this.tests = tests;
    }
}

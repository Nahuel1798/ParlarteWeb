package com.parlarte.parlarte.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class ReordenarClasesRequest {

    @NotEmpty(message = "La lista de clases no puede estar vacía")
    private List<Long> orden;

    public List<Long> getOrden() {
        return orden;
    }

    public void setOrden(List<Long> orden) {
        this.orden = orden;
    }
}

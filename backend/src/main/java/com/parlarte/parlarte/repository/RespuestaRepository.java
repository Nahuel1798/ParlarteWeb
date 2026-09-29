package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.Respuesta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RespuestaRepository extends JpaRepository<Respuesta, Long> {
    List<Respuesta> findByPreguntaIdOrderByIdAsc(Long preguntaId);
}
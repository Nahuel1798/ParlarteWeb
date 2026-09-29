package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.Pregunta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PreguntaRepository extends JpaRepository<Pregunta, Long> {
    List<Pregunta> findByTestIdOrderByIdAsc(Long testId);
}
package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.Clase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaseRepository extends JpaRepository<Clase, Long> {

    List<Clase> findByCursoIdOrderByIdAsc(Long cursoId);

    long countByCursoId(Long cursoId);
}
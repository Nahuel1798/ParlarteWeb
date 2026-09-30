package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.Clase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClaseRepository extends JpaRepository<Clase, Long> {

    List<Clase> findByCursoIdOrderByIdAsc(Long cursoId);

    List<Clase> findByCursoIdOrderByOrdenAscIdAsc(Long cursoId);

    long countByCursoId(Long cursoId);

    @Query("select count(distinct c.modulo) from Clase c where c.curso.id = :cursoId and c.modulo is not null")
    long countModulosDistintos(@Param("cursoId") Long cursoId);
}
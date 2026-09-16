package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    List<Curso> findByNombreContainingIgnoreCase(String nombre);

    Optional<Curso> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
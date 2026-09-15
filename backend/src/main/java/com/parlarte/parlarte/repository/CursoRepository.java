package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursoRepository extends JpaRepository<Curso, Long> {
}
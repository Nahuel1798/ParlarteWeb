package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByClaseIdOrderByIdAsc(Long claseId);
}
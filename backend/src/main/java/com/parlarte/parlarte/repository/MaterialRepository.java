package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByClaseIdOrderByIdAsc(Long claseId);

    long countByClase_Curso_Id(Long cursoId);
}
package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {
    List<Inscripcion> findByAlumnoId(Long alumnoId);

    Optional<Inscripcion> findByAlumnoIdAndCursoId(Long alumnoId, Long cursoId);

    boolean existsByAlumnoIdAndCursoId(Long alumnoId, Long cursoId);
}

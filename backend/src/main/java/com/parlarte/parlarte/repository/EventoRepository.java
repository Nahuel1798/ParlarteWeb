package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Long> {

    List<Evento> findByActivoTrueAndFechaBetweenOrderByFechaAsc(LocalDateTime desde, LocalDateTime hasta);

    List<Evento> findByActivoTrueAndFechaBetweenAndCursoIsNullOrderByFechaAsc(LocalDateTime desde, LocalDateTime hasta);

    List<Evento> findByActivoTrueAndFechaBetweenAndCursoIdInOrderByFechaAsc(LocalDateTime desde,
                                                                            LocalDateTime hasta,
                                                                            Collection<Long> cursoIds);
}

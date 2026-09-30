package com.parlarte.parlarte.service;

import com.parlarte.parlarte.dto.TareaRequest;
import com.parlarte.parlarte.dto.TareaResponse;
import com.parlarte.parlarte.entity.Clase;
import com.parlarte.parlarte.entity.Tarea;
import com.parlarte.parlarte.exception.ResourceNotFoundException;
import com.parlarte.parlarte.repository.TareaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;
    private final ClaseAccesoService claseAccesoService;

    public TareaService(TareaRepository tareaRepository, ClaseAccesoService claseAccesoService) {
        this.tareaRepository = tareaRepository;
        this.claseAccesoService = claseAccesoService;
    }

    @Transactional(readOnly = true)
    public List<TareaResponse> listarPorClase(Long cursoId, Long claseId, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoLecturaPorClase(cursoId, clase, email);
        return tareaRepository.findByClaseIdOrderByIdAsc(claseId).stream()
                .map(TareaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public TareaResponse crear(Long cursoId, Long claseId, TareaRequest request, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);

        Tarea tarea = new Tarea();
        tarea.setTitulo(request.getTitulo().trim());
        tarea.setDescripcion(request.getDescripcion().trim());
        tarea.setFechaEntrega(request.getFechaEntrega());
        tarea.setClase(clase);

        return TareaResponse.fromEntity(tareaRepository.save(tarea));
    }

    @Transactional
    public TareaResponse actualizar(Long cursoId, Long claseId, Long tareaId, TareaRequest request, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);

        Tarea tarea = buscarTareaEnClase(tareaId, claseId);
        tarea.setTitulo(request.getTitulo().trim());
        tarea.setDescripcion(request.getDescripcion().trim());
        tarea.setFechaEntrega(request.getFechaEntrega());

        return TareaResponse.fromEntity(tareaRepository.save(tarea));
    }

    @Transactional
    public void eliminar(Long cursoId, Long claseId, Long tareaId, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);

        Tarea tarea = buscarTareaEnClase(tareaId, claseId);
        tareaRepository.delete(tarea);
    }

    private Tarea buscarTareaEnClase(Long tareaId, Long claseId) {
        Tarea tarea = tareaRepository.findById(tareaId)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada con id: " + tareaId));
        if (!tarea.getClase().getId().equals(claseId)) {
            throw new ResourceNotFoundException("Tarea no encontrada en la clase indicada");
        }
        return tarea;
    }
}
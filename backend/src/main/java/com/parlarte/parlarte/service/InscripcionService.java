package com.parlarte.parlarte.service;

import com.parlarte.parlarte.dto.InscripcionRequest;
import com.parlarte.parlarte.dto.InscripcionResponse;
import com.parlarte.parlarte.entity.Curso;
import com.parlarte.parlarte.entity.Inscripcion;
import com.parlarte.parlarte.entity.Usuario;
import com.parlarte.parlarte.exception.ConflictException;
import com.parlarte.parlarte.exception.ResourceNotFoundException;
import com.parlarte.parlarte.repository.CursoRepository;
import com.parlarte.parlarte.repository.InscripcionRepository;
import com.parlarte.parlarte.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InscripcionService {

    private final InscripcionRepository inscripcionRepository;
    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;

    public InscripcionService(InscripcionRepository inscripcionRepository, UsuarioRepository usuarioRepository, CursoRepository cursoRepository) {
        this.inscripcionRepository = inscripcionRepository;
        this.usuarioRepository = usuarioRepository;
        this.cursoRepository = cursoRepository;
    }

    public List<InscripcionResponse> listarTodos() {
        return inscripcionRepository.findAll().stream()
                .map(InscripcionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public InscripcionResponse buscarPorId(Long id) {
        Inscripcion inscripcion = inscripcionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscripción no encontrada con id: " + id));
        return InscripcionResponse.fromEntity(inscripcion);
    }

    public List<InscripcionResponse> listarPorAlumno(Long alumnoId) {
        usuarioRepository.findById(alumnoId)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado con id: " + alumnoId));
        return inscripcionRepository.findByAlumnoId(alumnoId).stream()
                .map(InscripcionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public InscripcionResponse crear(InscripcionRequest request) {
        Long alumnoId = request.getAlumnoId();
        Long cursoId = request.getCursoId();

        Usuario alumno = usuarioRepository.findById(alumnoId)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado con id: " + alumnoId));

        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + cursoId));

        if (inscripcionRepository.existsByAlumnoIdAndCursoId(alumnoId, cursoId)) {
            throw new ConflictException("El alumno ya está inscrito en este curso");
        }

        Inscripcion inscripcion = new Inscripcion();
        inscripcion.setAlumno(alumno);
        inscripcion.setCurso(curso);

        return InscripcionResponse.fromEntity(inscripcionRepository.save(inscripcion));
    }

    public InscripcionResponse cancelar(Long id) {
        Inscripcion inscripcion = inscripcionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscripción no encontrada con id: " + id));

        if (!inscripcion.getActiva()) {
            throw new ConflictException("La inscripción ya está cancelada");
        }

        inscripcion.setActiva(false);
        return InscripcionResponse.fromEntity(inscripcionRepository.save(inscripcion));
    }

    public void eliminar(Long id) {
        Inscripcion inscripcion = inscripcionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscripción no encontrada con id: " + id));
        inscripcionRepository.delete(inscripcion);
    }
}
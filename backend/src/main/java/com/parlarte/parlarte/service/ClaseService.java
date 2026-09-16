package com.parlarte.parlarte.service;

import com.parlarte.parlarte.dto.ClaseRequest;
import com.parlarte.parlarte.dto.ClaseResponse;
import com.parlarte.parlarte.entity.Clase;
import com.parlarte.parlarte.entity.Curso;
import com.parlarte.parlarte.entity.Usuario;
import com.parlarte.parlarte.exception.ResourceNotFoundException;
import com.parlarte.parlarte.repository.ClaseRepository;
import com.parlarte.parlarte.repository.CursoRepository;
import com.parlarte.parlarte.repository.UsuarioRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaseService {

    private static final String ACCESO_DENEGADO = "Acceso denegado: solo el profesor asignado o un administrador pueden gestionar las clases";

    private final ClaseRepository claseRepository;
    private final CursoRepository cursoRepository;
    private final UsuarioRepository usuarioRepository;

    public ClaseService(ClaseRepository claseRepository,
                        CursoRepository cursoRepository,
                        UsuarioRepository usuarioRepository) {
        this.claseRepository = claseRepository;
        this.cursoRepository = cursoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<ClaseResponse> listarPorCurso(Long cursoId, String email) {
        Curso curso = buscarCurso(cursoId);
        verificarAcceso(curso, email);
        return claseRepository.findByCursoIdOrderByIdAsc(cursoId).stream()
                .map(ClaseResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClaseResponse crear(Long cursoId, ClaseRequest request, String email) {
        Curso curso = buscarCurso(cursoId);
        verificarAcceso(curso, email);

        Clase clase = new Clase();
        clase.setTitulo(request.getTitulo().trim());
        clase.setDescripcion(request.getDescripcion().trim());
        clase.setModulo(request.getModulo());
        clase.setCurso(curso);

        return ClaseResponse.fromEntity(claseRepository.save(clase));
    }

    @Transactional
    public ClaseResponse actualizar(Long claseId, ClaseRequest request, String email) {
        Clase clase = claseRepository.findById(claseId)
                .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada con id: " + claseId));
        verificarAcceso(clase.getCurso(), email);

        clase.setTitulo(request.getTitulo().trim());
        clase.setDescripcion(request.getDescripcion().trim());
        clase.setModulo(request.getModulo());

        return ClaseResponse.fromEntity(claseRepository.save(clase));
    }

    @Transactional
    public void eliminar(Long claseId, String email) {
        Clase clase = claseRepository.findById(claseId)
                .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada con id: " + claseId));
        verificarAcceso(clase.getCurso(), email);
        claseRepository.delete(clase);
    }

    private Curso buscarCurso(Long cursoId) {
        return cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + cursoId));
    }

    private void verificarAcceso(Curso curso, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException(ACCESO_DENEGADO));

        if (usuario.getRol() == Usuario.Rol.ADMINISTRADOR) {
            return;
        }

        if (usuario.getRol() == Usuario.Rol.PROFESOR
                && curso.getProfesor() != null
                && curso.getProfesor().getId().equals(usuario.getId())) {
            return;
        }

        throw new AccessDeniedException(ACCESO_DENEGADO);
    }
}
package com.parlarte.parlarte.service;

import com.parlarte.parlarte.entity.Clase;
import com.parlarte.parlarte.entity.Curso;
import com.parlarte.parlarte.entity.Inscripcion;
import com.parlarte.parlarte.entity.Usuario;
import com.parlarte.parlarte.exception.ResourceNotFoundException;
import com.parlarte.parlarte.repository.ClaseRepository;
import com.parlarte.parlarte.repository.CursoRepository;
import com.parlarte.parlarte.repository.InscripcionRepository;
import com.parlarte.parlarte.repository.UsuarioRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class ClaseAccesoService {

    private static final String ACCESO_DENEGADO = "Acceso denegado: solo el profesor asignado o un administrador pueden gestionar los recursos de esta clase";

    private static final String ACCESO_DENEGADO_LECTURA = "Acceso denegado: solo los alumnos inscritos pueden consultar el material de este curso";

    private final ClaseRepository claseRepository;
    private final CursoRepository cursoRepository;
    private final UsuarioRepository usuarioRepository;
    private final InscripcionRepository inscripcionRepository;

    public ClaseAccesoService(ClaseRepository claseRepository,
                              CursoRepository cursoRepository,
                              UsuarioRepository usuarioRepository,
                              InscripcionRepository inscripcionRepository) {
        this.claseRepository = claseRepository;
        this.cursoRepository = cursoRepository;
        this.usuarioRepository = usuarioRepository;
        this.inscripcionRepository = inscripcionRepository;
    }

    public Clase buscarClase(Long claseId) {
        return claseRepository.findById(claseId)
                .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada con id: " + claseId));
    }

    public Curso buscarCurso(Long cursoId) {
        return cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + cursoId));
    }

    public void verificarClasePerteneceAlCurso(Long cursoId, Clase clase) {
        if (!clase.getCurso().getId().equals(cursoId)) {
            throw new ResourceNotFoundException("Clase no encontrada en el curso indicado");
        }
    }

    public void verificarAccesoPorCurso(Curso curso, String email) {
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

    public void verificarAccesoPorClase(Long cursoId, Clase clase, String email) {
        verificarClasePerteneceAlCurso(cursoId, clase);
        verificarAccesoPorCurso(clase.getCurso(), email);
    }

    public void verificarAccesoLecturaPorCurso(Curso curso, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException(ACCESO_DENEGADO_LECTURA));

        if (usuario.getRol() == Usuario.Rol.ADMINISTRADOR) {
            return;
        }

        if (usuario.getRol() == Usuario.Rol.PROFESOR
                && curso.getProfesor() != null
                && curso.getProfesor().getId().equals(usuario.getId())) {
            return;
        }

        if (usuario.getRol() == Usuario.Rol.ALUMNO && estaInscrito(usuario.getId(), curso.getId())) {
            return;
        }

        throw new AccessDeniedException(ACCESO_DENEGADO_LECTURA);
    }

    public void verificarAccesoLecturaPorClase(Long cursoId, Clase clase, String email) {
        verificarClasePerteneceAlCurso(cursoId, clase);
        verificarAccesoLecturaPorCurso(clase.getCurso(), email);
    }

    private boolean estaInscrito(Long alumnoId, Long cursoId) {
        return inscripcionRepository.findByAlumnoIdAndCursoId(alumnoId, cursoId)
                .map(Inscripcion::getActiva)
                .orElse(Boolean.FALSE);
    }
}
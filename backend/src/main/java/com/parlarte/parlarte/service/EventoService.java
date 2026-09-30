package com.parlarte.parlarte.service;

import com.parlarte.parlarte.dto.EventoRequest;
import com.parlarte.parlarte.dto.EventoResponse;
import com.parlarte.parlarte.entity.Clase;
import com.parlarte.parlarte.entity.Curso;
import com.parlarte.parlarte.entity.Evento;
import com.parlarte.parlarte.entity.Inscripcion;
import com.parlarte.parlarte.entity.Usuario;
import com.parlarte.parlarte.exception.ResourceNotFoundException;
import com.parlarte.parlarte.repository.ClaseRepository;
import com.parlarte.parlarte.repository.CursoRepository;
import com.parlarte.parlarte.repository.EventoRepository;
import com.parlarte.parlarte.repository.InscripcionRepository;
import com.parlarte.parlarte.repository.UsuarioRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EventoService {

    private static final String ACCESO_DENEGADO_GLOBAL =
            "Acceso denegado: solo un administrador puede crear o modificar eventos generales";

    private static final String RANGO_INVALIDO =
            "El rango de fechas es inválido: la fecha final debe ser posterior a la inicial y no puede superar los 366 días";

    private static final int RANGO_MAXIMO_DIAS = 366;

    private final EventoRepository eventoRepository;
    private final CursoRepository cursoRepository;
    private final ClaseRepository claseRepository;
    private final UsuarioRepository usuarioRepository;
    private final InscripcionRepository inscripcionRepository;
    private final ClaseAccesoService claseAccesoService;

    public EventoService(EventoRepository eventoRepository,
                         CursoRepository cursoRepository,
                         ClaseRepository claseRepository,
                         UsuarioRepository usuarioRepository,
                         InscripcionRepository inscripcionRepository,
                         ClaseAccesoService claseAccesoService) {
        this.eventoRepository = eventoRepository;
        this.cursoRepository = cursoRepository;
        this.claseRepository = claseRepository;
        this.usuarioRepository = usuarioRepository;
        this.inscripcionRepository = inscripcionRepository;
        this.claseAccesoService = claseAccesoService;
    }

    @Transactional(readOnly = true)
    public List<EventoResponse> listar(LocalDateTime desde, LocalDateTime hasta, String email) {
        validarRango(desde, hasta);
        Usuario usuario = buscarUsuario(email);

        List<Evento> eventos;
        if (usuario.getRol() == Usuario.Rol.ADMINISTRADOR) {
            eventos = eventoRepository.findByActivoTrueAndFechaBetweenOrderByFechaAsc(desde, hasta);
        } else {
            Set<Long> cursoIds = cursoIdsVisibles(usuario);
            eventos = new ArrayList<>(
                    eventoRepository.findByActivoTrueAndFechaBetweenAndCursoIsNullOrderByFechaAsc(desde, hasta));
            if (!cursoIds.isEmpty()) {
                eventos.addAll(eventoRepository
                        .findByActivoTrueAndFechaBetweenAndCursoIdInOrderByFechaAsc(desde, hasta, cursoIds));
            }
            eventos.sort(Comparator.comparing(Evento::getFecha).thenComparing(Evento::getId));
        }

        return eventos.stream().map(EventoResponse::fromEntity).toList();
    }

    @Transactional
    public EventoResponse crear(EventoRequest request, String email) {
        Usuario usuario = buscarUsuario(email);
        verificarRolGestor(usuario);

        Curso curso = null;
        Clase clase = null;

        if (request.getClaseId() != null) {
            clase = claseAccesoService.buscarClase(request.getClaseId());
            curso = clase.getCurso();
        }

        if (request.getCursoId() != null) {
            curso = claseAccesoService.buscarCurso(request.getCursoId());
            if (clase != null) {
                claseAccesoService.verificarClasePerteneceAlCurso(curso.getId(), clase);
            }
        }

        verificarAccesoGestion(curso, usuario);

        Evento evento = new Evento();
        aplicar(evento, request, curso, clase);
        return EventoResponse.fromEntity(eventoRepository.save(evento));
    }

    @Transactional
    public EventoResponse actualizar(Long eventoId, EventoRequest request, String email) {
        Usuario usuario = buscarUsuario(email);
        verificarRolGestor(usuario);

        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con id: " + eventoId));
        verificarAccesoGestion(evento.getCurso(), usuario);

        Curso curso = evento.getCurso();
        Clase clase = evento.getClase();

        if (request.getClaseId() != null) {
            clase = claseAccesoService.buscarClase(request.getClaseId());
            curso = clase.getCurso();
        } else {
            clase = null;
        }

        if (request.getCursoId() != null) {
            curso = claseAccesoService.buscarCurso(request.getCursoId());
        }

        if (clase != null && curso != null) {
            claseAccesoService.verificarClasePerteneceAlCurso(curso.getId(), clase);
        }

        aplicar(evento, request, curso, clase);
        return EventoResponse.fromEntity(eventoRepository.save(evento));
    }

    @Transactional
    public void eliminar(Long eventoId, String email) {
        Usuario usuario = buscarUsuario(email);
        verificarRolGestor(usuario);

        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con id: " + eventoId));
        verificarAccesoGestion(evento.getCurso(), usuario);

        eventoRepository.delete(evento);
    }

    private void aplicar(Evento evento, EventoRequest request, Curso curso, Clase clase) {
        evento.setTitulo(request.getTitulo().trim());
        evento.setDescripcion(normalizar(request.getDescripcion()));
        evento.setFecha(request.getFecha());
        evento.setDuracionMinutos(request.getDuracionMinutos());
        evento.setTipo(request.getTipo());
        evento.setCurso(curso);
        evento.setClase(clase);
        evento.setActivo(true);
    }

    private void validarRango(LocalDateTime desde, LocalDateTime hasta) {
        if (desde == null || hasta == null
                || !hasta.isAfter(desde)
                || ChronoUnit.DAYS.between(desde, hasta) > RANGO_MAXIMO_DIAS) {
            throw new IllegalArgumentException(RANGO_INVALIDO);
        }
    }

    private Usuario buscarUsuario(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
    }

    private void verificarRolGestor(Usuario usuario) {
        if (usuario.getRol() != Usuario.Rol.ADMINISTRADOR
                && usuario.getRol() != Usuario.Rol.PROFESOR) {
            throw new AccessDeniedException("Acceso denegado: rol insuficiente");
        }
    }

    private void verificarAccesoGestion(Curso curso, Usuario usuario) {
        if (curso == null) {
            if (usuario.getRol() != Usuario.Rol.ADMINISTRADOR) {
                throw new AccessDeniedException(ACCESO_DENEGADO_GLOBAL);
            }
            return;
        }

        claseAccesoService.verificarAccesoPorCurso(curso, usuario.getEmail());
    }

    private Set<Long> cursoIdsVisibles(Usuario usuario) {
        if (usuario.getRol() == Usuario.Rol.PROFESOR) {
            return cursoRepository.findByProfesorId(usuario.getId()).stream()
                    .map(Curso::getId)
                    .collect(Collectors.toSet());
        }

        return inscripcionRepository.findByAlumnoIdAndActivaTrue(usuario.getId()).stream()
                .map(Inscripcion::getCurso)
                .filter(curso -> curso != null && curso.getId() != null)
                .map(Curso::getId)
                .collect(Collectors.toSet());
    }

    private String normalizar(String valor) {
        if (valor == null) {
            return null;
        }
        String trimmed = valor.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

package com.parlarte.parlarte.service;

import com.parlarte.parlarte.dto.UsuarioRequest;
import com.parlarte.parlarte.dto.UsuarioResponse;
import com.parlarte.parlarte.entity.Usuario;
import com.parlarte.parlarte.exception.ConflictException;
import com.parlarte.parlarte.exception.ResourceNotFoundException;
import com.parlarte.parlarte.repository.UsuarioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(UsuarioResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<UsuarioResponse> listarPorRol(Usuario.Rol rol) {
        return usuarioRepository.findByRol(rol).stream()
                .map(UsuarioResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public UsuarioResponse buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        return UsuarioResponse.fromEntity(usuario);
    }

    public UsuarioResponse buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(normalizarEmail(email))
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
        return UsuarioResponse.fromEntity(usuario);
    }

    public UsuarioResponse crear(UsuarioRequest request) {
        String email = normalizarEmail(request.getEmail());
        if (usuarioRepository.existsByEmail(email)) {
            throw new ConflictException("Ya existe un usuario con el email: " + email);
        }
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre().trim());
        usuario.setApellidos(request.getApellidos() == null ? null : request.getApellidos().trim());
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(request.getRol());
        usuario.setNivel(request.getNivel());
        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    public UsuarioResponse actualizar(Long id, UsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        String email = normalizarEmail(request.getEmail());
        if (usuarioRepository.existsByEmail(email) && !usuario.getEmail().equals(email)) {
            throw new ConflictException("Ya existe un usuario con el email: " + email);
        }
        usuario.setNombre(request.getNombre().trim());
        usuario.setApellidos(request.getApellidos() == null ? null : request.getApellidos().trim());
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(request.getRol());
        usuario.setNivel(request.getNivel());
        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con id: " + id);
        }
        try {
            usuarioRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("No se puede eliminar el usuario porque tiene cursos, inscripciones o pagos asociados");
        }
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase();
    }
}
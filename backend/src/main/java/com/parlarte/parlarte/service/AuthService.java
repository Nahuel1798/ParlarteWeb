package com.parlarte.parlarte.service;

import com.parlarte.parlarte.dto.LoginRequest;
import com.parlarte.parlarte.dto.LoginResponse;
import com.parlarte.parlarte.entity.Usuario;
import com.parlarte.parlarte.exception.ResourceNotFoundException;
import com.parlarte.parlarte.repository.UsuarioRepository;
import com.parlarte.parlarte.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       UsuarioRepository usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
        String token = jwtService.generarToken(usuario);
        return new LoginResponse(token, "Bearer", usuario.getEmail(), usuario.getNombre(), usuario.getRol(), usuario.getId());
    }
}
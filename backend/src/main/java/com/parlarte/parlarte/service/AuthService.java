package com.parlarte.parlarte.service;

import com.parlarte.parlarte.dto.LoginRequest;
import com.parlarte.parlarte.dto.LoginResponse;
import com.parlarte.parlarte.entity.RefreshToken;
import com.parlarte.parlarte.entity.Usuario;
import com.parlarte.parlarte.exception.ResourceNotFoundException;
import com.parlarte.parlarte.exception.UnauthorizedException;
import com.parlarte.parlarte.repository.RefreshTokenRepository;
import com.parlarte.parlarte.repository.UsuarioRepository;
import com.parlarte.parlarte.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       UsuarioRepository usuarioRepository,
                       RefreshTokenRepository refreshTokenRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public record Sesion(LoginResponse usuario, String accessToken, String refreshToken, boolean recordar) {
    }

    @Transactional
    public Sesion login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
        return crearSesion(usuario, request.isRecordar());
    }

    @Transactional
    public Sesion refrescar(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new UnauthorizedException("Refresh token requerido");
        }

        Claims claims;
        try {
            claims = jwtService.parse(refreshToken);
        } catch (JwtException | IllegalArgumentException ex) {
            throw new UnauthorizedException("Refresh token inválido o expirado");
        }

        if (!JwtService.Tipo.REFRESH.name().equals(claims.get("tipo"))) {
            throw new UnauthorizedException("El token no es un refresh token");
        }

        RefreshToken almacenado = refreshTokenRepository.findByTokenHash(hash(refreshToken))
                .orElseThrow(() -> new UnauthorizedException("Refresh token desconocido"));

        if (almacenado.isRevocado()) {
            // Posible reutilización de un token ya rotado: se revocan todos.
            refreshTokenRepository.deleteByUsuario(almacenado.getUsuario());
            throw new UnauthorizedException("Refresh token revocado");
        }

        if (almacenado.getExpiraEn().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("Refresh token expirado");
        }

        almacenado.setRevocado(true);
        refreshTokenRepository.save(almacenado);

        return crearSesion(almacenado.getUsuario(), almacenado.isRecordar());
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }
        refreshTokenRepository.findByTokenHash(hash(refreshToken)).ifPresent(token -> {
            token.setRevocado(true);
            refreshTokenRepository.save(token);
        });
    }

    @Transactional(readOnly = true)
    public LoginResponse actual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getName() == null) {
            throw new UnauthorizedException("No autenticado");
        }
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));
        return LoginResponse.desde(usuario);
    }

    private Sesion crearSesion(Usuario usuario, boolean recordar) {
        String accessToken = jwtService.generarAccessToken(usuario);
        String refreshToken = jwtService.generarRefreshToken(usuario);

        RefreshToken entidad = new RefreshToken();
        entidad.setTokenHash(hash(refreshToken));
        entidad.setUsuario(usuario);
        entidad.setExpiraEn(LocalDateTime.now()
                .plus(Duration.ofMillis(jwtService.getRefreshExpirationMs())));
        entidad.setRevocado(false);
        entidad.setRecordar(recordar);
        refreshTokenRepository.save(entidad);

        return new Sesion(LoginResponse.desde(usuario), accessToken, refreshToken, recordar);
    }

    private static String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(bytes);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 no disponible", ex);
        }
    }
}

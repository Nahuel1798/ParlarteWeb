package com.parlarte.parlarte.security;

import com.parlarte.parlarte.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    public enum Tipo {
        ACCESS,
        REFRESH
    }

    private static final String CLAIM_TIPO = "tipo";

    private final SecretKey signingKey;
    private final long accessExpirationMs;
    private final long refreshExpirationMs;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration}") long accessExpirationMs,
                      @Value("${app.jwt.refresh-expiration}") long refreshExpirationMs) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpirationMs = accessExpirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    public String generarAccessToken(Usuario usuario) {
        return generar(usuario, Tipo.ACCESS, accessExpirationMs);
    }

    public String generarRefreshToken(Usuario usuario) {
        return generar(usuario, Tipo.REFRESH, refreshExpirationMs);
    }

    private String generar(Usuario usuario, Tipo tipo, long expirationMs) {
        Instant ahora = Instant.now();
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(usuario.getEmail())
                .claim("id", usuario.getId())
                .claim("rol", usuario.getRol().name())
                .claim(CLAIM_TIPO, tipo.name())
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(ahora.plusMillis(expirationMs)))
                .signWith(signingKey)
                .compact();
    }

    /**
     * Valida la firma y expiración del token. Lanza {@link JwtException} si el
     * token es inválido o está expirado.
     */
    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extraerEmail(String token) {
        return parse(token).getSubject();
    }

    public boolean esTipo(String token, Tipo tipo) {
        Object valor = parse(token).get(CLAIM_TIPO);
        return tipo.name().equals(valor);
    }

    public boolean esValido(String token, UserDetails userDetails) {
        if (token == null || token.isBlank()) {
            return false;
        }
        try {
            Claims claims = parse(token);
            return Tipo.ACCESS.name().equals(claims.get(CLAIM_TIPO))
                    && userDetails.getUsername().equals(claims.getSubject())
                    && claims.getExpiration() != null
                    && claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public long getRefreshExpirationMs() {
        return refreshExpirationMs;
    }
}

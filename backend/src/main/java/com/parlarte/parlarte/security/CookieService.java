package com.parlarte.parlarte.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import java.time.Duration;
import java.util.Optional;

@Component
public class CookieService {

    public static final String RUTA_ACCESS = "/";
    public static final String RUTA_REFRESH = "/api/auth";

    private final String accessName;
    private final String refreshName;
    private final boolean secure;
    private final String sameSite;
    private final long accessExpirationMs;
    private final long refreshExpirationMs;

    public CookieService(@Value("${app.cookies.access-name:parlarte_access}") String accessName,
                         @Value("${app.cookies.refresh-name:parlarte_refresh}") String refreshName,
                         @Value("${app.cookies.secure:false}") boolean secure,
                         @Value("${app.cookies.same-site:Lax}") String sameSite,
                         @Value("${app.jwt.expiration}") long accessExpirationMs,
                         @Value("${app.jwt.refresh-expiration}") long refreshExpirationMs) {
        this.accessName = accessName;
        this.refreshName = refreshName;
        this.secure = secure;
        this.sameSite = sameSite;
        this.accessExpirationMs = accessExpirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    public ResponseCookie accessCookie(String token) {
        return base(accessName, token)
                .path(RUTA_ACCESS)
                .maxAge(Duration.ofMillis(accessExpirationMs))
                .build();
    }

    /**
     * Cookie de refresh. Si {@code recordar} es {@code false} se emite como
     * cookie de sesión (se borra al cerrar el navegador).
     */
    public ResponseCookie refreshCookie(String token, boolean recordar) {
        ResponseCookie.ResponseCookieBuilder builder = base(refreshName, token).path(RUTA_REFRESH);
        if (recordar) {
            builder.maxAge(Duration.ofMillis(refreshExpirationMs));
        }
        return builder.build();
    }

    public ResponseCookie borrarAccessCookie() {
        return base(accessName, "").path(RUTA_ACCESS).maxAge(Duration.ZERO).build();
    }

    public ResponseCookie borrarRefreshCookie() {
        return base(refreshName, "").path(RUTA_REFRESH).maxAge(Duration.ZERO).build();
    }

    public Optional<String> accessToken(HttpServletRequest request) {
        return leerCookie(request, accessName);
    }

    public Optional<String> refreshToken(HttpServletRequest request) {
        return leerCookie(request, refreshName);
    }

    public String accessName() {
        return accessName;
    }

    private ResponseCookie.ResponseCookieBuilder base(String nombre, String valor) {
        return ResponseCookie.from(nombre, valor)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite);
    }

    private Optional<String> leerCookie(HttpServletRequest request, String nombre) {
        Cookie cookie = WebUtils.getCookie(request, nombre);
        if (cookie == null || cookie.getValue() == null || cookie.getValue().isBlank()) {
            return Optional.empty();
        }
        return Optional.of(cookie.getValue());
    }
}

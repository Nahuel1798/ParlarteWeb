package com.parlarte.parlarte.controller;

import com.parlarte.parlarte.dto.LoginRequest;
import com.parlarte.parlarte.dto.LoginResponse;
import com.parlarte.parlarte.security.CookieService;
import com.parlarte.parlarte.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final CookieService cookieService;

    public AuthController(AuthService authService, CookieService cookieService) {
        this.authService = authService;
        this.cookieService = cookieService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthService.Sesion sesion = authService.login(request);
        return conCookies(sesion, sesion.recordar());
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(HttpServletRequest request) {
        String refreshToken = cookieService.refreshToken(request).orElse(null);
        AuthService.Sesion sesion = authService.refrescar(refreshToken);
        return conCookies(sesion, sesion.recordar());
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse> me() {
        return ResponseEntity.ok(authService.actual());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        authService.logout(cookieService.refreshToken(request).orElse(null));
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookieService.borrarAccessCookie().toString())
                .header(HttpHeaders.SET_COOKIE, cookieService.borrarRefreshCookie().toString())
                .build();
    }

    private ResponseEntity<LoginResponse> conCookies(AuthService.Sesion sesion, boolean recordar) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, cookieService.accessCookie(sesion.accessToken()).toString());
        headers.add(HttpHeaders.SET_COOKIE, cookieService.refreshCookie(sesion.refreshToken(), recordar).toString());
        return ResponseEntity.ok().headers(headers).body(sesion.usuario());
    }
}

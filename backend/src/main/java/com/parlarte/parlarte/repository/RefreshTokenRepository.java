package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.RefreshToken;
import com.parlarte.parlarte.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    void deleteByUsuario(Usuario usuario);

    void deleteByExpiraEnBefore(LocalDateTime fecha);
}

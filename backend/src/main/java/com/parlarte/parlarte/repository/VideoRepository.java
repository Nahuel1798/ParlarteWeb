package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.Videos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoRepository extends JpaRepository<Videos, Long> {
    List<Videos> findByClaseIdOrderByIdAsc(Long claseId);
}
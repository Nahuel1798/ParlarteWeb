package com.parlarte.parlarte.repository;

import com.parlarte.parlarte.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByClaseIdOrderByIdAsc(Long claseId);
}
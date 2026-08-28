package com.fixmanager.fixmanagerbackend.repository;

import com.fixmanager.fixmanagerbackend.entity.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterventionRepository extends JpaRepository<Intervention, Long> {
}
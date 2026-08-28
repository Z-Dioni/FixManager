package com.fixmanager.fixmanagerbackend.repository;

import com.fixmanager.fixmanagerbackend.entity.Accessoire;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessoireRepository extends JpaRepository<Accessoire, Long> {
}
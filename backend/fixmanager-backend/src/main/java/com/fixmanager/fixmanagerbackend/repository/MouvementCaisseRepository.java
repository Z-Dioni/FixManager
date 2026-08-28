package com.fixmanager.fixmanagerbackend.repository;

import com.fixmanager.fixmanagerbackend.entity.MouvementCaisse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MouvementCaisseRepository extends JpaRepository<MouvementCaisse, Long> {
}
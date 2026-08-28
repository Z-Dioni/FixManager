package com.fixmanager.fixmanagerbackend.repository;

import com.fixmanager.fixmanagerbackend.entity.InterventionTechnicien;
import com.fixmanager.fixmanagerbackend.entity.InterventionTechnicienId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterventionTechnicienRepository
        extends JpaRepository<InterventionTechnicien, InterventionTechnicienId> {
}
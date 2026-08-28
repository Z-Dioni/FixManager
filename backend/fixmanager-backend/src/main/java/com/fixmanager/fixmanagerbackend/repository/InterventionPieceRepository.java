package com.fixmanager.fixmanagerbackend.repository;

import com.fixmanager.fixmanagerbackend.entity.InterventionPiece;
import com.fixmanager.fixmanagerbackend.entity.InterventionPieceId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterventionPieceRepository
        extends JpaRepository<InterventionPiece, InterventionPieceId> {
}
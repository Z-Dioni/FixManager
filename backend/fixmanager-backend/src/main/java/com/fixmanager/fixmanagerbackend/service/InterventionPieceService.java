package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.InterventionPiece;
import com.fixmanager.fixmanagerbackend.entity.InterventionPieceId;
import com.fixmanager.fixmanagerbackend.repository.InterventionPieceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterventionPieceService {
    private final InterventionPieceRepository repository;

    public InterventionPieceService(InterventionPieceRepository repository) {
        this.repository = repository;
    }

    public List<InterventionPiece> findAll() { return repository.findAll(); }
    public Optional<InterventionPiece> findById(InterventionPieceId id) {
        return repository.findById(id);
    }
    public InterventionPiece save(InterventionPiece interventionPiece) {
        return repository.save(interventionPiece);
    }
    public void deleteById(InterventionPieceId id) { repository.deleteById(id); }
}
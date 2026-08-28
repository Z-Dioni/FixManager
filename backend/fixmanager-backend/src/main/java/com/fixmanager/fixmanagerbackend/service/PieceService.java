package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Piece;
import com.fixmanager.fixmanagerbackend.repository.PieceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PieceService {
    private final PieceRepository repository;

    public PieceService(PieceRepository repository) {
        this.repository = repository;
    }

    public List<Piece> findAll() { return repository.findAll(); }
    public Optional<Piece> findById(Long id) { return repository.findById(id); }
    public Piece save(Piece piece) { return repository.save(piece); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
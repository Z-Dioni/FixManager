package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.LigneFacture;
import com.fixmanager.fixmanagerbackend.repository.LigneFactureRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LigneFactureService {
    private final LigneFactureRepository repository;

    public LigneFactureService(LigneFactureRepository repository) {
        this.repository = repository;
    }

    public List<LigneFacture> findAll() { return repository.findAll(); }
    public Optional<LigneFacture> findById(Long id) { return repository.findById(id); }
    public LigneFacture save(LigneFacture ligneFacture) { return repository.save(ligneFacture); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
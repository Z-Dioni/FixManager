package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.LigneDevis;
import com.fixmanager.fixmanagerbackend.repository.LigneDevisRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LigneDevisService {
    private final LigneDevisRepository repository;

    public LigneDevisService(LigneDevisRepository repository) {
        this.repository = repository;
    }

    public List<LigneDevis> findAll() { return repository.findAll(); }
    public Optional<LigneDevis> findById(Long id) { return repository.findById(id); }
    public LigneDevis save(LigneDevis ligneDevis) { return repository.save(ligneDevis); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Facture;
import com.fixmanager.fixmanagerbackend.repository.FactureRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FactureService {
    private final FactureRepository repository;

    public FactureService(FactureRepository repository) {
        this.repository = repository;
    }

    public List<Facture> findAll() { return repository.findAll(); }
    public Optional<Facture> findById(Long id) { return repository.findById(id); }
    public Facture save(Facture facture) { return repository.save(facture); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
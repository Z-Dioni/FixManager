package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Devis;
import com.fixmanager.fixmanagerbackend.repository.DevisRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DevisService {
    private final DevisRepository repository;

    public DevisService(DevisRepository repository) {
        this.repository = repository;
    }

    public List<Devis> findAll() { return repository.findAll(); }
    public Optional<Devis> findById(Long id) { return repository.findById(id); }
    public Devis save(Devis devis) { return repository.save(devis); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
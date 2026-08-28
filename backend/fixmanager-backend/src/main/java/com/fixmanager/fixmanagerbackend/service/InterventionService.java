package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Intervention;
import com.fixmanager.fixmanagerbackend.repository.InterventionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterventionService {
    private final InterventionRepository repository;

    public InterventionService(InterventionRepository repository) {
        this.repository = repository;
    }

    public List<Intervention> findAll() { return repository.findAll(); }
    public Optional<Intervention> findById(Long id) { return repository.findById(id); }
    public Intervention save(Intervention intervention) { return repository.save(intervention); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
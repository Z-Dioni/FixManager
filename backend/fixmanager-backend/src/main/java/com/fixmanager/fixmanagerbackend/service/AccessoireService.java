package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Accessoire;
import com.fixmanager.fixmanagerbackend.repository.AccessoireRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccessoireService {
    private final AccessoireRepository repository;

    public AccessoireService(AccessoireRepository repository) {
        this.repository = repository;
    }

    public List<Accessoire> findAll() { return repository.findAll(); }
    public Optional<Accessoire> findById(Long id) { return repository.findById(id); }
    public Accessoire save(Accessoire accessoire) { return repository.save(accessoire); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
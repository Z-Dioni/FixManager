package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Historique;
import com.fixmanager.fixmanagerbackend.repository.HistoriqueRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HistoriqueService {
    private final HistoriqueRepository repository;

    public HistoriqueService(HistoriqueRepository repository) {
        this.repository = repository;
    }

    public List<Historique> findAll() { return repository.findAll(); }
    public Optional<Historique> findById(Long id) { return repository.findById(id); }
    public Historique save(Historique historique) { return repository.save(historique); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
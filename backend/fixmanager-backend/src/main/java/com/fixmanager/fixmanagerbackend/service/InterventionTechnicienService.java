package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.InterventionTechnicien;
import com.fixmanager.fixmanagerbackend.entity.InterventionTechnicienId;
import com.fixmanager.fixmanagerbackend.repository.InterventionTechnicienRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterventionTechnicienService {
    private final InterventionTechnicienRepository repository;

    public InterventionTechnicienService(InterventionTechnicienRepository repository) {
        this.repository = repository;
    }

    public List<InterventionTechnicien> findAll() { return repository.findAll(); }
    public Optional<InterventionTechnicien> findById(InterventionTechnicienId id) {
        return repository.findById(id);
    }
    public InterventionTechnicien save(InterventionTechnicien interventionTechnicien) {
        return repository.save(interventionTechnicien);
    }
    public void deleteById(InterventionTechnicienId id) { repository.deleteById(id); }
}
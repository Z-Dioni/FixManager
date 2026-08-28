package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Paiement;
import com.fixmanager.fixmanagerbackend.repository.PaiementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaiementService {
    private final PaiementRepository repository;

    public PaiementService(PaiementRepository repository) {
        this.repository = repository;
    }

    public List<Paiement> findAll() { return repository.findAll(); }
    public Optional<Paiement> findById(Long id) { return repository.findById(id); }
    public Paiement save(Paiement paiement) { return repository.save(paiement); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
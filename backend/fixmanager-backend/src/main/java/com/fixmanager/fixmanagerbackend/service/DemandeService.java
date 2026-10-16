package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Demande;
import com.fixmanager.fixmanagerbackend.repository.DemandeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class DemandeService {

    private final DemandeRepository repository;

    public DemandeService(DemandeRepository repository) {
        this.repository = repository;
    }

    public List<Demande> findAll() {
        return repository.findAll();
    }

    public Optional<Demande> findById(Long id) {
        return repository.findById(id);
    }

    public Demande save(Demande demande) {
        if (demande.getIdDemande() == null) {
            demande.setDateDemande(LocalDateTime.now());
            if (demande.getDateSouhaitee() == null) {
                demande.setDateSouhaitee(demande.getDateDemande());
            }
            demande.setStatut("NOUVELLE");
            Demande savedDemande = repository.save(demande);
            savedDemande.setReference(String.format("DEM-%04d", savedDemande.getIdDemande()));
            return repository.save(savedDemande);
        }

        return repository.save(demande);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Facture;
import com.fixmanager.fixmanagerbackend.repository.FactureRepository;
import com.fixmanager.fixmanagerbackend.repository.InterventionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class FactureService {
    private final FactureRepository repository;
    private final InterventionRepository interventionRepository;

    public FactureService(FactureRepository repository, InterventionRepository interventionRepository) {
        this.repository = repository;
        this.interventionRepository = interventionRepository;
    }

    public List<Facture> findAll() { return repository.findAll(); }
    public Optional<Facture> findById(Long id) { return repository.findById(id); }
    public Facture save(Facture facture) {
        if (facture.getIntervention() == null || facture.getIntervention().getIdIntervention() == null) {
            throw new IllegalArgumentException("Une facture doit etre liee a une intervention");
        }

        var intervention = interventionRepository.findById(facture.getIntervention().getIdIntervention())
                .orElseThrow(() -> new IllegalArgumentException("Intervention introuvable"));
        if (!"TERMINEE".equals(intervention.getStatut())) {
            throw new IllegalArgumentException("Une facture ne peut etre creee que pour une intervention terminee");
        }

        BigDecimal total = BigDecimal.ZERO;
        if (facture.getLignes() != null) {
            for (var ligne : facture.getLignes()) {
                ligne.setFacture(facture);
                ligne.setTotal(ligne.getQuantite().multiply(ligne.getPrixUnitaire()));
                total = total.add(ligne.getTotal());
            }
        }
        facture.setTotal(total);

        if (facture.getIdFacture() == null) {
            facture.setDateFacture(LocalDateTime.now());
            facture.setStatut("A_PAYER");
            Facture savedFacture = repository.save(facture);
            savedFacture.setReference(String.format("FAC-%04d", savedFacture.getIdFacture()));
            return repository.save(savedFacture);
        }

        return repository.save(facture);
    }
    public void deleteById(Long id) { repository.deleteById(id); }
}
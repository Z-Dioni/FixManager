package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Devis;
import com.fixmanager.fixmanagerbackend.repository.DevisRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class DevisService {
    private final DevisRepository repository;

    public DevisService(DevisRepository repository) {
        this.repository = repository;
    }

    public List<Devis> findAll() { return repository.findAll(); }
    public Optional<Devis> findById(Long id) { return repository.findById(id); }
    public Devis save(Devis devis) {
        BigDecimal total = BigDecimal.ZERO;
        if (devis.getLignes() != null) {
            for (var ligne : devis.getLignes()) {
                ligne.setDevis(devis);
                ligne.setTotal(ligne.getQuantite().multiply(ligne.getPrixUnitaire()));
                total = total.add(ligne.getTotal());
            }
        }
        devis.setTotal(total);

        if (devis.getIdDevis() == null) {
            devis.setDateDevis(LocalDateTime.now());
            devis.setDateValidite(LocalDate.now().plusDays(30));
            devis.setStatut("BROUILLON");
            Devis savedDevis = repository.save(devis);
            savedDevis.setReference(String.format("DEV-%04d", savedDevis.getIdDevis()));
            return repository.save(savedDevis);
        }

        return repository.save(devis);
    }

    public Devis updateStatus(Long id, String statut) {
        Devis devis = repository.findById(id).orElseThrow();
        if ("ACCEPTE".equals(devis.getStatut()) && "REFUSE".equals(statut)) {
            throw new IllegalArgumentException("Un devis accepte ne peut pas etre refuse");
        }
        devis.setStatut(statut);
        return repository.save(devis);
    }
    @Transactional
    public void deleteById(Long id) {
        Devis devis = repository.findById(id).orElseThrow();
        if (devis.getDemande() != null) {
            devis.getDemande().setDevis(null);
        }
        repository.delete(devis);
    }
}
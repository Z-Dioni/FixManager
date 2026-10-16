package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.MouvementCaisse;
import com.fixmanager.fixmanagerbackend.entity.Paiement;
import com.fixmanager.fixmanagerbackend.repository.FactureRepository;
import com.fixmanager.fixmanagerbackend.repository.MouvementCaisseRepository;
import com.fixmanager.fixmanagerbackend.repository.PaiementRepository;
import com.fixmanager.fixmanagerbackend.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaiementService {
    private final PaiementRepository repository;
    private final FactureRepository factureRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final MouvementCaisseRepository mouvementRepository;

    public PaiementService(PaiementRepository repository, FactureRepository factureRepository,
                           UtilisateurRepository utilisateurRepository, MouvementCaisseRepository mouvementRepository) {
        this.repository = repository;
        this.factureRepository = factureRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.mouvementRepository = mouvementRepository;
    }

    public List<Paiement> findAll() { return repository.findAll(); }
    public Optional<Paiement> findById(Long id) { return repository.findById(id); }
    @Transactional
    public Paiement save(Paiement paiement) {
        if (paiement.getIdPaiement() != null) {
            throw new IllegalArgumentException("Un paiement enregistré ne peut pas être modifié");
        }
        if (paiement.getMontant() == null || paiement.getMontant().signum() <= 0) {
            throw new IllegalArgumentException("Le montant du paiement doit être supérieur à zéro");
        }
        if (paiement.getModePaiement() == null || paiement.getModePaiement().isBlank()) {
            throw new IllegalArgumentException("Le mode de paiement est obligatoire");
        }
        if (paiement.getFacture() == null || paiement.getFacture().getIdFacture() == null) {
            throw new IllegalArgumentException("Le paiement doit être rattaché à une facture");
        }
        if (paiement.getUtilisateur() == null || paiement.getUtilisateur().getIdUtilisateur() == null) {
            throw new IllegalArgumentException("Le paiement doit être enregistré par un utilisateur");
        }

        var facture = factureRepository.findById(paiement.getFacture().getIdFacture())
                .orElseThrow(() -> new IllegalArgumentException("La facture est introuvable"));
        var utilisateur = utilisateurRepository.findById(paiement.getUtilisateur().getIdUtilisateur())
                .orElseThrow(() -> new IllegalArgumentException("L'utilisateur est introuvable"));
        if ("ANNULEE".equals(facture.getStatut()) || "PAYEE".equals(facture.getStatut())) {
            throw new IllegalArgumentException("Cette facture ne peut plus recevoir de paiement");
        }

        BigDecimal dejaPaye = repository.findByFactureIdFacture(facture.getIdFacture()).stream()
                .map(Paiement::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal restant = facture.getTotal().subtract(dejaPaye);
        if (paiement.getMontant().compareTo(restant) > 0) {
            throw new IllegalArgumentException("Le paiement dépasse le montant restant de la facture");
        }

        paiement.setFacture(facture);
        paiement.setUtilisateur(utilisateur);
        paiement.setDatePaiement(LocalDateTime.now());
        Paiement saved = repository.save(paiement);

        MouvementCaisse mouvement = new MouvementCaisse();
        mouvement.setType("ENTREE");
        mouvement.setMontant(saved.getMontant());
        mouvement.setMotif("Paiement de la facture " + facture.getReference());
        mouvement.setDateMouvement(saved.getDatePaiement());
        mouvement.setPaiement(saved);
        mouvement.setUtilisateur(utilisateur);
        mouvementRepository.save(mouvement);

        BigDecimal nouveauTotalPaye = dejaPaye.add(saved.getMontant());
        facture.setStatut(nouveauTotalPaye.compareTo(facture.getTotal()) == 0 ? "PAYEE" : "PARTIELLEMENT_PAYEE");
        factureRepository.save(facture);
        return saved;
    }
    public void deleteById(Long id) { repository.deleteById(id); }
}
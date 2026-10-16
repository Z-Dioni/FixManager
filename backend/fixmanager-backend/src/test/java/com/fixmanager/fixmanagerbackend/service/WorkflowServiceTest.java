package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Devis;
import com.fixmanager.fixmanagerbackend.entity.Facture;
import com.fixmanager.fixmanagerbackend.entity.Intervention;
import com.fixmanager.fixmanagerbackend.repository.DevisRepository;
import com.fixmanager.fixmanagerbackend.repository.FactureRepository;
import com.fixmanager.fixmanagerbackend.repository.InterventionRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class WorkflowServiceTest {

    @Test
    void refuseUneTransitionDevisDepuisUnDevisAccepte() {
        DevisRepository repository = mock(DevisRepository.class);
        InterventionRepository interventionRepository = mock(InterventionRepository.class);
        Devis devis = new Devis();
        devis.setStatut("ACCEPTE");
        when(repository.findById(1L)).thenReturn(Optional.of(devis));

        DevisService service = new DevisService(repository);

        assertThrows(IllegalArgumentException.class, () -> service.updateStatus(1L, "REFUSE"));
    }

    @Test
    void refuseUneFacturePourUneInterventionNonTerminee() {
        FactureRepository repository = mock(FactureRepository.class);
        InterventionRepository interventionRepository = mock(InterventionRepository.class);
        Intervention intervention = new Intervention();
        intervention.setIdIntervention(1L);
        intervention.setStatut("EN_COURS");
        when(interventionRepository.findById(1L)).thenReturn(Optional.of(intervention));
        Facture facture = new Facture();
        facture.setIntervention(intervention);

        FactureService service = new FactureService(repository, interventionRepository);

        assertThrows(IllegalArgumentException.class, () -> service.save(facture));
    }
}
package com.fixmanager.fixmanagerbackend.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "intervention_technicien")
public class InterventionTechnicien {

    @EmbeddedId
    private InterventionTechnicienId id = new InterventionTechnicienId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idIntervention")
    @JoinColumn(name = "id_intervention", nullable = false)
    private Intervention intervention;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idUtilisateur")
    @JoinColumn(name = "id_utilisateur", nullable = false)
    @JsonIgnore
    private Utilisateur utilisateur;

    public InterventionTechnicien() {
    }

    public InterventionTechnicienId getId() {
        return id;
    }

    public void setId(InterventionTechnicienId id) {
        this.id = id;
    }

    public Intervention getIntervention() {
        return intervention;
    }

    public void setIntervention(Intervention intervention) {
        this.intervention = intervention;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
}
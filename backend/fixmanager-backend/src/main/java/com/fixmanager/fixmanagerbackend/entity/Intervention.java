package com.fixmanager.fixmanagerbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "intervention")
public class Intervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idIntervention;

    private String reference;
    private String diagnostic;
    private String causePanne;
    private String travailEffectue;
    private String statut;

    @OneToOne
    @JoinColumn(name = "id_demande", nullable = false, unique = true)
    private Demande demande;

    @OneToMany(mappedBy = "intervention")
    private List<InterventionTechnicien> techniciens = new ArrayList<>();

    @OneToMany(mappedBy = "intervention")
    private List<InterventionPiece> pieces = new ArrayList<>();

    public Intervention() {
    }

    public Long getIdIntervention() {
        return idIntervention;
    }

    public void setIdIntervention(Long idIntervention) {
        this.idIntervention = idIntervention;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getDiagnostic() {
        return diagnostic;
    }

    public void setDiagnostic(String diagnostic) {
        this.diagnostic = diagnostic;
    }

    public String getCausePanne() {
        return causePanne;
    }

    public void setCausePanne(String causePanne) {
        this.causePanne = causePanne;
    }

    public String getTravailEffectue() {
        return travailEffectue;
    }

    public void setTravailEffectue(String travailEffectue) {
        this.travailEffectue = travailEffectue;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Demande getDemande() {
        return demande;
    }

    public void setDemande(Demande demande) {
        this.demande = demande;
    }

    public List<InterventionTechnicien> getTechniciens() {
        return techniciens;
    }

    public void setTechniciens(List<InterventionTechnicien> techniciens) {
        this.techniciens = techniciens;
    }

    public List<InterventionPiece> getPieces() {
        return pieces;
    }

    public void setPieces(List<InterventionPiece> pieces) {
        this.pieces = pieces;
    }
}
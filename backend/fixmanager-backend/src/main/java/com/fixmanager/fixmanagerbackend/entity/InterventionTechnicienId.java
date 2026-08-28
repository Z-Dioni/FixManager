package com.fixmanager.fixmanagerbackend.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class InterventionTechnicienId implements Serializable {

    private Long idIntervention;
    private Long idUtilisateur;

    public InterventionTechnicienId() {
    }

    public InterventionTechnicienId(Long idIntervention, Long idUtilisateur) {
        this.idIntervention = idIntervention;
        this.idUtilisateur = idUtilisateur;
    }

    public Long getIdIntervention() {
        return idIntervention;
    }

    public void setIdIntervention(Long idIntervention) {
        this.idIntervention = idIntervention;
    }

    public Long getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(Long idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (!(object instanceof InterventionTechnicienId that)) return false;
        return Objects.equals(idIntervention, that.idIntervention)
                && Objects.equals(idUtilisateur, that.idUtilisateur);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idIntervention, idUtilisateur);
    }
}
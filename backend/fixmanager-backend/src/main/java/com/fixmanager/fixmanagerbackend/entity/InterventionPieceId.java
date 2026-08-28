package com.fixmanager.fixmanagerbackend.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class InterventionPieceId implements Serializable {

    private Long idIntervention;
    private Long idPiece;

    public InterventionPieceId() {
    }

    public InterventionPieceId(Long idIntervention, Long idPiece) {
        this.idIntervention = idIntervention;
        this.idPiece = idPiece;
    }

    public Long getIdIntervention() {
        return idIntervention;
    }

    public void setIdIntervention(Long idIntervention) {
        this.idIntervention = idIntervention;
    }

    public Long getIdPiece() {
        return idPiece;
    }

    public void setIdPiece(Long idPiece) {
        this.idPiece = idPiece;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (!(object instanceof InterventionPieceId that)) return false;
        return Objects.equals(idIntervention, that.idIntervention)
                && Objects.equals(idPiece, that.idPiece);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idIntervention, idPiece);
    }
}
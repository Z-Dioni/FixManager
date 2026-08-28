package com.fixmanager.fixmanagerbackend.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "intervention_piece")
public class InterventionPiece {

    @EmbeddedId
    private InterventionPieceId id = new InterventionPieceId();

    private BigDecimal quantite = BigDecimal.ONE;
    private BigDecimal prixUnitaire = BigDecimal.ZERO;
    private BigDecimal total = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idIntervention")
    @JoinColumn(name = "id_intervention", nullable = false)
    private Intervention intervention;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idPiece")
    @JoinColumn(name = "id_piece", nullable = false)
    private Piece piece;

    public InterventionPiece() {
    }

    public InterventionPieceId getId() {
        return id;
    }

    public void setId(InterventionPieceId id) {
        this.id = id;
    }

    public BigDecimal getQuantite() {
        return quantite;
    }

    public void setQuantite(BigDecimal quantite) {
        this.quantite = quantite;
    }

    public BigDecimal getPrixUnitaire() {
        return prixUnitaire;
    }

    public void setPrixUnitaire(BigDecimal prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public Intervention getIntervention() {
        return intervention;
    }

    public void setIntervention(Intervention intervention) {
        this.intervention = intervention;
    }

    public Piece getPiece() {
        return piece;
    }

    public void setPiece(Piece piece) {
        this.piece = piece;
    }
}
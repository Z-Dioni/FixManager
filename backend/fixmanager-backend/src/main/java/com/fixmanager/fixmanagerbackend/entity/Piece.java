package com.fixmanager.fixmanagerbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "piece")
public class Piece {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPiece;

    private String reference;
    private String designation;

    @OneToMany(mappedBy = "piece")
    private List<InterventionPiece> interventions = new ArrayList<>();

    public Piece() {
    }

    public Long getIdPiece() {
        return idPiece;
    }

    public void setIdPiece(Long idPiece) {
        this.idPiece = idPiece;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public List<InterventionPiece> getInterventions() {
        return interventions;
    }

    public void setInterventions(List<InterventionPiece> interventions) {
        this.interventions = interventions;
    }
}
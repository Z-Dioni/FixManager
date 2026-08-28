package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.Demande;
import com.fixmanager.fixmanagerbackend.service.DemandeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/demandes")
public class DemandeController {

    private final DemandeService service;

    public DemandeController(DemandeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Demande> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Demande> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Demande> create(@RequestBody Demande demande) {
        return ResponseEntity.ok(service.save(demande));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Demande> update(@PathVariable Long id, @RequestBody Demande demande) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        demande.setIdDemande(id);
        return ResponseEntity.ok(service.save(demande));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
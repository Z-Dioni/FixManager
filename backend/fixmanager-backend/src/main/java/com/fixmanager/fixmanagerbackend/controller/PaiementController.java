package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.Paiement;
import com.fixmanager.fixmanagerbackend.service.PaiementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {
    private final PaiementService service;

    public PaiementController(PaiementService service) { this.service = service; }
    @GetMapping public List<Paiement> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Paiement> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<Paiement> create(@RequestBody Paiement value) {
        return ResponseEntity.ok(service.save(value));
    }
    @PutMapping("/{id}") public ResponseEntity<Paiement> update(@PathVariable Long id, @RequestBody Paiement value) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        value.setIdPaiement(id);
        return ResponseEntity.ok(service.save(value));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
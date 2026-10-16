package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.Devis;
import com.fixmanager.fixmanagerbackend.service.DevisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devis")
public class DevisController {
    private final DevisService service;

    public DevisController(DevisService service) { this.service = service; }
    @GetMapping public List<Devis> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Devis> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<Devis> create(@RequestBody Devis value) {
        return ResponseEntity.ok(service.save(value));
    }
    @PatchMapping("/{id}/statut") public ResponseEntity<Devis> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        if (!service.findById(id).isPresent() || body.get("statut") == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(service.updateStatus(id, body.get("statut")));
    }
    @PutMapping("/{id}") public ResponseEntity<Devis> update(@PathVariable Long id, @RequestBody Devis value) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        value.setIdDevis(id);
        return ResponseEntity.ok(service.save(value));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
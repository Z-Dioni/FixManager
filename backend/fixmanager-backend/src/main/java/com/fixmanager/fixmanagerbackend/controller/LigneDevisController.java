package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.LigneDevis;
import com.fixmanager.fixmanagerbackend.service.LigneDevisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lignes-devis")
public class LigneDevisController {
    private final LigneDevisService service;

    public LigneDevisController(LigneDevisService service) { this.service = service; }
    @GetMapping public List<LigneDevis> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<LigneDevis> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<LigneDevis> create(@RequestBody LigneDevis value) {
        return ResponseEntity.ok(service.save(value));
    }
    @PutMapping("/{id}") public ResponseEntity<LigneDevis> update(@PathVariable Long id, @RequestBody LigneDevis value) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        value.setIdLigneDevis(id);
        return ResponseEntity.ok(service.save(value));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
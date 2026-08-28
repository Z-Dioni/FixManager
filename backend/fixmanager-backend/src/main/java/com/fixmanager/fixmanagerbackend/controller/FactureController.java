package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.Facture;
import com.fixmanager.fixmanagerbackend.service.FactureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/factures")
public class FactureController {
    private final FactureService service;

    public FactureController(FactureService service) { this.service = service; }
    @GetMapping public List<Facture> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Facture> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<Facture> create(@RequestBody Facture value) {
        return ResponseEntity.ok(service.save(value));
    }
    @PutMapping("/{id}") public ResponseEntity<Facture> update(@PathVariable Long id, @RequestBody Facture value) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        value.setIdFacture(id);
        return ResponseEntity.ok(service.save(value));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
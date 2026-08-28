package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.LigneFacture;
import com.fixmanager.fixmanagerbackend.service.LigneFactureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lignes-factures")
public class LigneFactureController {
    private final LigneFactureService service;

    public LigneFactureController(LigneFactureService service) { this.service = service; }
    @GetMapping public List<LigneFacture> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<LigneFacture> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<LigneFacture> create(@RequestBody LigneFacture value) {
        return ResponseEntity.ok(service.save(value));
    }
    @PutMapping("/{id}") public ResponseEntity<LigneFacture> update(@PathVariable Long id, @RequestBody LigneFacture value) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        value.setIdLigneFacture(id);
        return ResponseEntity.ok(service.save(value));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
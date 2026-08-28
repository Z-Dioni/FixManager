package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.Historique;
import com.fixmanager.fixmanagerbackend.service.HistoriqueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historiques")
public class HistoriqueController {
    private final HistoriqueService service;

    public HistoriqueController(HistoriqueService service) { this.service = service; }
    @GetMapping public List<Historique> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Historique> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<Historique> create(@RequestBody Historique value) {
        return ResponseEntity.ok(service.save(value));
    }
    @PutMapping("/{id}") public ResponseEntity<Historique> update(@PathVariable Long id, @RequestBody Historique value) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        value.setIdHistorique(id);
        return ResponseEntity.ok(service.save(value));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
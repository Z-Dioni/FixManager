package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.Intervention;
import com.fixmanager.fixmanagerbackend.service.InterventionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interventions")
public class InterventionController {
    private final InterventionService service;

    public InterventionController(InterventionService service) { this.service = service; }
    @GetMapping public List<Intervention> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Intervention> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<Intervention> create(@RequestBody Intervention value) {
        return ResponseEntity.ok(service.save(value));
    }
    @PutMapping("/{id}") public ResponseEntity<Intervention> update(@PathVariable Long id, @RequestBody Intervention value) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        value.setIdIntervention(id);
        return ResponseEntity.ok(service.save(value));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.Accessoire;
import com.fixmanager.fixmanagerbackend.service.AccessoireService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accessoires")
public class AccessoireController {
    private final AccessoireService service;

    public AccessoireController(AccessoireService service) { this.service = service; }
    @GetMapping public List<Accessoire> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Accessoire> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<Accessoire> create(@RequestBody Accessoire value) {
        return ResponseEntity.ok(service.save(value));
    }
    @PutMapping("/{id}") public ResponseEntity<Accessoire> update(@PathVariable Long id, @RequestBody Accessoire value) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        value.setIdAccessoire(id);
        return ResponseEntity.ok(service.save(value));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.MouvementCaisse;
import com.fixmanager.fixmanagerbackend.service.MouvementCaisseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mouvements-caisse")
public class MouvementCaisseController {
    private final MouvementCaisseService service;

    public MouvementCaisseController(MouvementCaisseService service) { this.service = service; }
    @GetMapping public List<MouvementCaisse> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<MouvementCaisse> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<MouvementCaisse> create(@RequestBody MouvementCaisse value) {
        return ResponseEntity.ok(service.save(value));
    }
    @PutMapping("/{id}") public ResponseEntity<MouvementCaisse> update(@PathVariable Long id, @RequestBody MouvementCaisse value) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        value.setIdMouvement(id);
        return ResponseEntity.ok(service.save(value));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
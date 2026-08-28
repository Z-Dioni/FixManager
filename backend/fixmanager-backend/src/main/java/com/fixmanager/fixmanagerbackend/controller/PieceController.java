package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.Piece;
import com.fixmanager.fixmanagerbackend.service.PieceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pieces")
public class PieceController {
    private final PieceService service;

    public PieceController(PieceService service) { this.service = service; }
    @GetMapping public List<Piece> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Piece> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<Piece> create(@RequestBody Piece value) {
        return ResponseEntity.ok(service.save(value));
    }
    @PutMapping("/{id}") public ResponseEntity<Piece> update(@PathVariable Long id, @RequestBody Piece value) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        value.setIdPiece(id);
        return ResponseEntity.ok(service.save(value));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
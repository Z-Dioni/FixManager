package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.InterventionPiece;
import com.fixmanager.fixmanagerbackend.entity.InterventionPieceId;
import com.fixmanager.fixmanagerbackend.service.InterventionPieceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interventions-pieces")
public class InterventionPieceController {
    private final InterventionPieceService service;

    public InterventionPieceController(InterventionPieceService service) { this.service = service; }
    @GetMapping public List<InterventionPiece> findAll() { return service.findAll(); }

    @GetMapping("/{idIntervention}/{idPiece}")
    public ResponseEntity<InterventionPiece> findById(
            @PathVariable Long idIntervention,
            @PathVariable Long idPiece
    ) {
        return service.findById(new InterventionPieceId(idIntervention, idPiece))
                .map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping public ResponseEntity<InterventionPiece> create(@RequestBody InterventionPiece value) {
        return ResponseEntity.ok(service.save(value));
    }

    @PutMapping("/{idIntervention}/{idPiece}")
    public ResponseEntity<InterventionPiece> update(
            @PathVariable Long idIntervention,
            @PathVariable Long idPiece,
            @RequestBody InterventionPiece value
    ) {
        InterventionPieceId id = new InterventionPieceId(idIntervention, idPiece);
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        value.setId(id);
        return ResponseEntity.ok(service.save(value));
    }

    @DeleteMapping("/{idIntervention}/{idPiece}")
    public ResponseEntity<Void> delete(
            @PathVariable Long idIntervention,
            @PathVariable Long idPiece
    ) {
        InterventionPieceId id = new InterventionPieceId(idIntervention, idPiece);
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
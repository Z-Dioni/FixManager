package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.InterventionTechnicien;
import com.fixmanager.fixmanagerbackend.entity.InterventionTechnicienId;
import com.fixmanager.fixmanagerbackend.service.InterventionTechnicienService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interventions-techniciens")
public class InterventionTechnicienController {
    private final InterventionTechnicienService service;

    public InterventionTechnicienController(InterventionTechnicienService service) { this.service = service; }
    @GetMapping public List<InterventionTechnicien> findAll() { return service.findAll(); }

    @GetMapping("/{idIntervention}/{idUtilisateur}")
    public ResponseEntity<InterventionTechnicien> findById(
            @PathVariable Long idIntervention,
            @PathVariable Long idUtilisateur
    ) {
        return service.findById(new InterventionTechnicienId(idIntervention, idUtilisateur))
                .map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping public ResponseEntity<InterventionTechnicien> create(@RequestBody InterventionTechnicien value) {
        return ResponseEntity.ok(service.save(value));
    }

    @PutMapping("/{idIntervention}/{idUtilisateur}")
    public ResponseEntity<InterventionTechnicien> update(
            @PathVariable Long idIntervention,
            @PathVariable Long idUtilisateur,
            @RequestBody InterventionTechnicien value
    ) {
        InterventionTechnicienId id = new InterventionTechnicienId(idIntervention, idUtilisateur);
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        value.setId(id);
        return ResponseEntity.ok(service.save(value));
    }

    @DeleteMapping("/{idIntervention}/{idUtilisateur}")
    public ResponseEntity<Void> delete(
            @PathVariable Long idIntervention,
            @PathVariable Long idUtilisateur
    ) {
        InterventionTechnicienId id = new InterventionTechnicienId(idIntervention, idUtilisateur);
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
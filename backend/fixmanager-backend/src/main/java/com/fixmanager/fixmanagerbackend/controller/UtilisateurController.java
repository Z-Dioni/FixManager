package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.Utilisateur;
import com.fixmanager.fixmanagerbackend.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService service;

    public UtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    @GetMapping
    public List<Utilisateur> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Utilisateur> create(@RequestBody Utilisateur utilisateur) {
        return ResponseEntity.ok(service.save(utilisateur));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> update(
            @PathVariable Long id,
            @RequestBody Utilisateur utilisateur
    ) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        utilisateur.setIdUtilisateur(id);
        return ResponseEntity.ok(service.save(utilisateur));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
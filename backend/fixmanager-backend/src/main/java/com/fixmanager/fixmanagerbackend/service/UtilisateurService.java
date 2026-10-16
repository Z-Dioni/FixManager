package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Utilisateur;
import com.fixmanager.fixmanagerbackend.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    private final UtilisateurRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Utilisateur> findAll() {
        return repository.findAll();
    }

    public Optional<Utilisateur> findById(Long id) {
        return repository.findById(id);
    }

    public Utilisateur save(Utilisateur utilisateur) {
        if (utilisateur.getIdUtilisateur() != null) {
            var existing = repository.findById(utilisateur.getIdUtilisateur())
                    .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
            if (utilisateur.getPassword() == null || utilisateur.getPassword().isBlank()) {
                utilisateur.setPassword(existing.getPassword());
            }
        }
        if (utilisateur.getPassword() == null || utilisateur.getPassword().isBlank()) {
            throw new IllegalArgumentException("Le mot de passe est obligatoire");
        }
        if (!utilisateur.getPassword().startsWith("$2a$") && !utilisateur.getPassword().startsWith("$2b$") && !utilisateur.getPassword().startsWith("$2y$")) {
            utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
        }
        return repository.save(utilisateur);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
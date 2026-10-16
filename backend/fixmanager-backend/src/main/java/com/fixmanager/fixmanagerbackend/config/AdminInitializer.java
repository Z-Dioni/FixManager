package com.fixmanager.fixmanagerbackend.config;

import com.fixmanager.fixmanagerbackend.entity.Role;
import com.fixmanager.fixmanagerbackend.entity.Utilisateur;
import com.fixmanager.fixmanagerbackend.repository.RoleRepository;
import com.fixmanager.fixmanagerbackend.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminInitializer implements ApplicationRunner {
    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public AdminInitializer(
            UtilisateurRepository utilisateurRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            @Value("${FIXMANAGER_ADMIN_EMAIL:}") String adminEmail,
            @Value("${FIXMANAGER_ADMIN_PASSWORD:}") String adminPassword
    ) {
        this.utilisateurRepository = utilisateurRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            return;
        }
        if (adminPassword.length() < 8) {
            throw new IllegalStateException("FIXMANAGER_ADMIN_PASSWORD doit contenir au moins 8 caracteres");
        }

        Role adminRole = roleRepository.findAll().stream()
                .filter(role -> "ADMIN".equalsIgnoreCase(role.getNom()))
                .findFirst()
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setNom("ADMIN");
                    return roleRepository.save(role);
                });

        Utilisateur admin = utilisateurRepository.findByEmailIgnoreCase(adminEmail)
                .orElseGet(Utilisateur::new);
        admin.setEmail(adminEmail);
        admin.setNom("Administrateur");
        admin.setActif(true);
        admin.getRoles().add(adminRole);
        if (!passwordEncoder.matches(adminPassword, admin.getPassword())) {
            admin.setPassword(passwordEncoder.encode(adminPassword));
        }
        utilisateurRepository.save(admin);
    }
}
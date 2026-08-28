package com.fixmanager.fixmanagerbackend.repository;

import com.fixmanager.fixmanagerbackend.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
}
package com.fixmanager.fixmanagerbackend.repository;

import com.fixmanager.fixmanagerbackend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}
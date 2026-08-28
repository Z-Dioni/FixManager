package com.fixmanager.fixmanagerbackend.repository;

import com.fixmanager.fixmanagerbackend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}
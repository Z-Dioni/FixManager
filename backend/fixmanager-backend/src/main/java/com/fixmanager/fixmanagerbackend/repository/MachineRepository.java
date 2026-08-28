package com.fixmanager.fixmanagerbackend.repository;

import com.fixmanager.fixmanagerbackend.entity.Machine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MachineRepository extends JpaRepository<Machine, Long> {
}
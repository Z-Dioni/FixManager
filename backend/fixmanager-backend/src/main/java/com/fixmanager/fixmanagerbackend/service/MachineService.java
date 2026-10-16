package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.Machine;
import com.fixmanager.fixmanagerbackend.repository.MachineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MachineService {

    private final MachineRepository repository;

    public MachineService(MachineRepository repository) {
        this.repository = repository;
    }

    public List<Machine> findAll() {
        return repository.findAll();
    }

    public Optional<Machine> findById(Long id) {
        return repository.findById(id);
    }

    public Machine save(Machine machine) {
        if (machine.getIdMachine() == null) {
            Machine savedMachine = repository.save(machine);
            savedMachine.setReference(String.format("MACH-%04d", savedMachine.getIdMachine()));
            return repository.save(savedMachine);
        }

        return repository.save(machine);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
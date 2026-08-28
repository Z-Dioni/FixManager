package com.fixmanager.fixmanagerbackend.controller;

import com.fixmanager.fixmanagerbackend.entity.Machine;
import com.fixmanager.fixmanagerbackend.service.MachineService;
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
@RequestMapping("/api/machines")
public class MachineController {

    private final MachineService service;

    public MachineController(MachineService service) {
        this.service = service;
    }

    @GetMapping
    public List<Machine> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Machine> findById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Machine> create(@RequestBody Machine machine) {
        return ResponseEntity.ok(service.save(machine));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Machine> update(@PathVariable Long id, @RequestBody Machine machine) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        machine.setIdMachine(id);
        return ResponseEntity.ok(service.save(machine));
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